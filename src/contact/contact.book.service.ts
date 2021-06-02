import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Contact } from './contact';
import { ContactDTO, ContactPostDTO, ContactReferenceDTO } from './contact.dto';
import { ContactMeans } from './contact.means';
import { ContactMeansEqualException } from './exceptions/contact.means.equal.exception';
import { ContactMeansSingleRemovedException } from './exceptions/contact.means.single.removed.exception';
import { ContactNameEqualException } from './exceptions/contact.name.equal.exception';
import { ContactMeansMainRemovedException } from './exceptions/contact.means.main.removed.exception'; 
import { Settings } from './settings';
import { SettingsDTO } from './settings.dto';
import { ContactMeansDTO, ContactMeansPostDTO, ContactMeansReferenceDTO } from './contact.means.dto';

@Injectable()
export class ContactBookService {

  constructor(
    @InjectRepository(Contact) private contacts: Repository<Contact>, 
    @InjectRepository(ContactMeans) private means: Repository<ContactMeans>,
    @InjectRepository(Settings) private settings: Repository<Settings>) {}

  list = async(): Promise<string> => {
    const contactsListed: Contact[] = 
        await this.contacts.createQueryBuilder('contact')
                           .leftJoinAndSelect('contact.means', 'means')
                           .orderBy('means.id', 'ASC')
                           .getMany();
    for (const item of contactsListed) {
      /* TODO */ item['label'] = item.means.find(contactMeans => contactMeans.isMain).value;
    }
    return JSON.stringify(contactsListed);
  }

  listContactMeans = async(id: number): Promise<string> => {
    const contact: Contact = await this._listContact(id);
    return JSON.stringify(contact.means);
  }

  private _listContact = async (id: number): Promise<Contact> => {
    return await this.contacts.createQueryBuilder('contact')
                              .leftJoinAndSelect('contact.means', 'means')
                              .where('contact.id = :contactId', {contactId: id})
                              .orderBy('means.id', 'ASC')
                              .getOne();
  }

  add = async(contactPostDTO: ContactPostDTO): Promise<string> => {
    const contact: Contact = contactPostDTO.asNewContact();
    const contactsWithSameNamesFound: Contact[] = await this.contacts.find({name: Equal(contact.name)});
    if (contactsWithSameNamesFound?.length) throw new ContactNameEqualException();
    const contactInserted: Contact = await this.contacts.save(contact);
    contactInserted.firstContactMeans.contact = null;
    return JSON.stringify(contactInserted);
  }

  put = async(contactDTO: ContactDTO): Promise<string> => {
    const contact: Contact = contactDTO.asContact();
    const contactsWithSameNamesFound: Contact[] = await this.contacts.find({name: Equal(contact.name)});
    const contactItemListed = contactsWithSameNamesFound.find((item) => item.id != contact.id)
    if (contactItemListed) throw new ContactNameEqualException();
    await this.contacts.save(contact);
    return JSON.stringify(contactDTO);
  }

  delete = async(contactReferenceDTO: ContactReferenceDTO): Promise<string> => {
    const contact: Contact = await this.contacts.findOne(contactReferenceDTO.id, {relations: ['means']});
    if (contact.means) await this.means.remove(contact.means) 
    await this.contacts.remove(contact);
    return '';
  }

  addContactMeans = async(contactMeansPostDTO: ContactMeansPostDTO): Promise<string> => {
    const contactMeans: ContactMeans = contactMeansPostDTO.asNewContactMeans();
    contactMeans.contact = await this.contacts.findOne(contactMeansPostDTO.contact.id, {relations: ['means']})
    const contactMeansItemListed: ContactMeans = await this._listContactMeans(contactMeans);
    if (contactMeansItemListed) throw new ContactMeansEqualException();
    if (contactMeans.contact.hasContactMeans && contactMeans.isMain) {
      contactMeans.contact.disableAllContactMeansMain();
      await this.means.save(contactMeans.contact.means);
    }
    const contactMeansInserted: ContactMeans = await this.means.save(contactMeans);
    return JSON.stringify({id: contactMeansInserted.id, name: contactMeans.name, value: contactMeans.value, 
        isMain: contactMeans.isMain, contact: new Contact()});
  }

  private _listContactMeans = async (contactMeans: ContactMeans) => {
    const criteria = { name: contactMeans.name, value: contactMeans.value, contactId: contactMeans.contact.id };
    return await this.means.createQueryBuilder('means')
                           .leftJoinAndSelect('means.contact', 'contact')
                           .where('means.name = :name AND means.value = :value AND contact.id = :contactId', criteria)
                           .getOne();
  }

  putContactMeans = async(contactMeansDTO: ContactMeansDTO): Promise<string> => {
    const contactMeans: ContactMeans = contactMeansDTO.asContactMeans();
    contactMeans.contact = await this.contacts.findOne(contactMeansDTO.contact.id, {relations: ['means']})
    const contactMeansListed: ContactMeans = await this._listContactMeans(contactMeans);
    if (contactMeansListed && contactMeansListed?.id != contactMeans.id) throw new ContactMeansEqualException();
    if (contactMeans.contact.hasContactMeans && contactMeans.isMain) {
      contactMeans.contact.disableAllContactMeansMain();
      await this.means.save(contactMeans.contact.means);
    }
    const contactInserted: ContactMeans = await this.means.save(contactMeans);
    return JSON.stringify({id: contactInserted.id, name: contactMeans.name, value: contactMeans.value, 
        isMain: contactMeans.isMain, contact: new Contact()});
  }

  deleteContactMeans = async(contactMeansReferenceDTO: ContactMeansReferenceDTO): Promise<string> => {
    const contactMeans: ContactMeans = await this.means.findOne(contactMeansReferenceDTO.id, {relations: ['contact']});
    const contact: Contact = await this._listContact(contactMeans.contact.id);
    const isContactMeansMainAndGreaterThanOne = contactMeans.isMain && contact.isContactMeansGreaterThanOne;
    if (isContactMeansMainAndGreaterThanOne) throw new ContactMeansMainRemovedException();
    if (contact.isSingleContactMeans) throw new ContactMeansSingleRemovedException();
    await this.means.delete(contactMeans);
    return '';
  }

  getSettings = async(id: string): Promise<string> => {
    const settings: Settings = await this.settings.findOne(id);
    return JSON.stringify(settings);
  }

  putSettings = async(settingsDTO: SettingsDTO): Promise<string> => {
    const settings: Settings = await this.settings.findOne(settingsDTO.id);
    settings.value = settingsDTO.value;
    const settingsUpdated: Settings = await this.settings.save(settings);
    return JSON.stringify(settingsUpdated);
  }
}
