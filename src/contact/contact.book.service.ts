import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Contact } from './contact';
import { ContactDTO } from './contact.dto';
import { ContactMeans } from './contact.means';
import { ContactMeansNameEqualException } from './exceptions/contact.means.name.equal.exception';
import { ContactMeansSingleRemovedException } from './exceptions/contact.means.single.removed.exception';
import { ContactNameEqualException } from './exceptions/contact.name.equal.exception';
import { ContactMeansMainRemovedException } from './exceptions/contact.means.main.removed.exception'; 
import { Settings } from './settings';
import { SettingsDTO } from './settings.dto';

@Injectable()
export class ContactBookService {

  constructor(
    @InjectRepository(Contact) private contactsRepository: Repository<Contact>, 
    @InjectRepository(ContactMeans) private contactMeansRepository: Repository<ContactMeans>,
    @InjectRepository(Settings) private settingsRepository: Repository<Settings>) {}

  list = async(): Promise<string> => {
    const contactsListed: Contact[] = 
        await this.contactsRepository.createQueryBuilder('contact')
                                     .leftJoinAndSelect('contact.means', 'means')
                                     .orderBy('means.id', 'ASC')
                                     .getMany();
    for (const item of contactsListed) {
      item['label'] = item.means.find(contactMeans => contactMeans.isMain).value;
    }
    return JSON.stringify(contactsListed);
  }

  listId = async(id: number): Promise<string> => {
    const contact: Contact = await this.contactsRepository.findOne(id, {relations: ['means']});
    return JSON.stringify(contact);
  }

  listContactMeans = async(id: number): Promise<string> => {
    const contact: Contact = 
        await this.contactsRepository.createQueryBuilder('contact')
                                     .leftJoinAndSelect('contact.means', 'means')
                                     .where('contact.id = :contactId', {contactId: id})
                                     .orderBy('means.id', 'ASC')
                                     .getOne();
    return JSON.stringify(contact.means);
  }

  add = async(contactDTO: ContactDTO): Promise<string> => {
    const contact: Contact = new Contact();
    contact.name = contactDTO.name;
    contact.description = contactDTO.description;
    const item: ContactMeans = new ContactMeans();
    item.contact = contact;
    item.name = contactDTO['means'][0].name;
    item.value = contactDTO['means'][0].value;
    item.isMain = true;
    contact.means = [item];
    const contactsListed: Contact[] = await this.contactsRepository.find({name: Equal(contact.name)});
    if (contactsListed?.length??false) throw new ContactNameEqualException();
    const contactInserted: Contact = await this.contactsRepository.save(contact);
    contactInserted.means[0].contact = null;
    return JSON.stringify(contactInserted);
  }

  put = async(contactDTO: ContactDTO): Promise<string> => {
    const contact: Contact = new Contact();
    contact.id = contactDTO.id;
    contact.name = contactDTO.name;
    contact.description = contactDTO.description;
    const contactsListed: Contact[] = await this.contactsRepository.find({name: Equal(contact.name)});
    const item = contactsListed.find((item) => item.id != contact.id)
    if (item) throw new ContactNameEqualException();
    await this.contactsRepository.save(contact);
    return JSON.stringify(contactDTO);
  }

  delete = async(contactDTO: ContactDTO): Promise<string> => {
    const contact: Contact = await this.contactsRepository.findOne(contactDTO.id, {relations: ['means']});
    if (contact.means) await this.contactMeansRepository.remove(contact.means) 
    await this.contactsRepository.remove(contact);
    return '';
  }

  addContactMeans = async(contactMeansDTO): Promise<string> => {
    const contactMeans: ContactMeans = new ContactMeans();
    contactMeans.id = contactMeansDTO.id ? contactMeansDTO.id : undefined;
    contactMeans.name = contactMeansDTO.name;
    contactMeans.value = contactMeansDTO.value;
    contactMeans.isMain = contactMeansDTO.isMain;
    contactMeans.contact = await this.contactsRepository.findOne(contactMeansDTO.contact.id, {relations: ['means']})
    const contactMeansNameEqual: ContactMeans = 
        await this.contactMeansRepository.createQueryBuilder('means')
                                          .leftJoinAndSelect('means.contact', 'contact')
                                          .where('means.name = :name AND means.value = :value AND contact.id = :contactId', {
                                              name: contactMeansDTO.name, value: contactMeansDTO.value, contactId: contactMeansDTO.contact.id})
                                          .getOne();
    if (contactMeansNameEqual) throw new ContactMeansNameEqualException();
    const hasMeans = contactMeans.contact.means && contactMeans.contact.means.length;
    if (hasMeans && contactMeans.isMain) {
      for (let i: number = 0; i < contactMeans.contact.means.length; i++) {
        const item = contactMeans.contact.means[i];
        item.isMain = false;
      }
      await this.contactMeansRepository.save(contactMeans.contact.means);
    }
    const contactInserted: ContactMeans = await this.contactMeansRepository.save(contactMeans);
    return JSON.stringify({id: contactInserted.id, name: contactMeans.name, value: contactMeans.value, 
        isMain: contactMeans.isMain, contact: new Contact()});
  }

  putContactMeans = async(contactMeansDTO): Promise<string> => {
    const contactMeans: ContactMeans = new ContactMeans();
    contactMeans.id = contactMeansDTO.id;
    contactMeans.name = contactMeansDTO.name;
    contactMeans.value = contactMeansDTO.value;
    contactMeans.isMain = contactMeansDTO.isMain;
    contactMeans.contact = await this.contactsRepository.findOne(contactMeansDTO.contact.id, {relations: ['means']})
    const meansListed: ContactMeans = 
        await this.contactMeansRepository.createQueryBuilder('means')
                                         .leftJoinAndSelect('means.contact', 'contact')
                                         .where('means.name = :name AND means.value = :value AND contact.id = :contactId ', {
                                              name: contactMeansDTO.name, value: contactMeansDTO.value, contactId: contactMeansDTO.contact.id})
                                         .getOne();
    if (meansListed && meansListed.id != contactMeans.id) throw new ContactMeansNameEqualException();
    const hasMeans = contactMeans.contact.means && contactMeans.contact.means.length;
    if (hasMeans && contactMeans.isMain) {
      for (let item of contactMeans.contact.means) {
        item.isMain = false;
      }
      await this.contactMeansRepository.save(contactMeans.contact.means);
    }
    const contactInserted: ContactMeans = await this.contactMeansRepository.save(contactMeans);
    return JSON.stringify({id: contactInserted.id, name: contactMeans.name, value: contactMeans.value, 
        isMain: contactMeans.isMain, contact: new Contact()});
  }

  deleteContactMeans = async(contactMeansDTO): Promise<string> => {
    const contact: Contact = 
        await this.contactsRepository.createQueryBuilder('contact')
                                     .leftJoinAndSelect('contact.means', 'means')
                                     .where('contact.id = :contactId', {contactId: contactMeansDTO.contact.id})
                                     .orderBy('means.id', 'ASC')
                                     .getOne();
    if (contact.means.length > 1 && contactMeansDTO.isMain) throw new ContactMeansMainRemovedException();
    if (contact.means.length == 1) throw new ContactMeansSingleRemovedException();
    const contactMeans: ContactMeans = await this.contactMeansRepository.findOne(contactMeansDTO.id);
    await this.contactMeansRepository.delete(contactMeans);
    return '';
  }

  getSettings = async(id: string): Promise<string> => {
    const settings: Settings = await this.settingsRepository.findOne(id);
    return JSON.stringify(settings);
  }

  putSettings = async(settingsDTO: SettingsDTO): Promise<string> => {
    const settings: Settings = await this.settingsRepository.findOne(settingsDTO.id);
    settings.value = settingsDTO.value;
    const settingsUpdated: Settings = await this.settingsRepository.save(settings);
    return JSON.stringify({id: settingsUpdated.id, value: settings.value});
  }
}
