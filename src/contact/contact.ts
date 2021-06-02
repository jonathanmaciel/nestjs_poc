import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { ContactMeans } from "./contact.means";

@Entity({name: 'tb_contacts'})
export class Contact {

  @PrimaryGeneratedColumn({name: 'contacts_id'})
  id: number;

  @Column({name: 'contacts_name'})
  name: string;

  @Column({name: 'contacts_description'})
  description: string;

  @OneToMany(() => ContactMeans, means => means.contact, {cascade: ['insert', 'update', 'remove']})
  means: ContactMeans[];

  get isContactMeansGreaterThanOne(): Boolean {
    return this.means.length > 1;
  }  

  get isSingleContactMeans(): Boolean {
    return this.means.length == 1;
  }

  get hasContactMeans(): Boolean {
    return this.means?.length > 1;
  }

  disableAllContactMeansMain(): void {
    if (this.hasContactMeans) for (const item of this.means) {
      item.isMain = false;
    }
  }

  get firstContactMeans(): ContactMeans {
    return this.means[0];
  }
}
