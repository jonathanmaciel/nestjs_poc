import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { Contact } from './contact';

@Entity({name: 'tb_contact_means'})
export class ContactMeans {

  @PrimaryGeneratedColumn({name: 'contact_means_id'})
  id: number;

  @Column({name: 'contact_means_name'})
  name: string;

  @Column({name: 'contact_means_value'})
  value: string;

  @Column({name: 'contact_means_description'})
  description: string;

  @Column({name: 'contact_means_is_main', default: '0'})
  isMain: Boolean;

  @ManyToOne(() => Contact, contact => contact.means)
  @JoinColumn({name: 'contacts_id', referencedColumnName: 'id'})
  contact: Contact;
}
