import { plainToClass, Type } from "class-transformer";
import { IsInt, IsNotEmpty, Min, ValidateNested } from "class-validator";
import { Contact } from "./contact";
import { ContactMeans } from "./contact.means";
import { OmitType } from "@nestjs/mapped-types";
import { ContactMeansCascadePostDTO, ContactMeansPostDTO } from "./contact.means.dto";

export class ContactDTO {

  @IsNotEmpty({message: 'contact dto id is required'})
  @IsInt({message: 'contact dto id is int'})
  @Min(1, {message: 'contact dto id is greater than 1'})
  id: number;

  @IsNotEmpty({message: 'contact dto name is required'})
  name: string;
  
  description: string;

  asContact(): Contact {
    return plainToClass(Contact, this);
  }
}

export class ContactPostDTO extends OmitType(ContactDTO, ['id'] as const) {

  @IsNotEmpty({message: 'contact dto means is required'})
  @ValidateNested({each: true})
  @Type(() => ContactMeansCascadePostDTO)
  means: ContactMeansCascadePostDTO[];

  asNewContact(): Contact {
    const contact: Contact = plainToClass(Contact, this);
    contact.id = undefined;
    if (this.means) {
      const firstContactMeansDTO: any = this.means.shift();
      const firstContactMeans: ContactMeans = plainToClass(ContactMeans, firstContactMeansDTO);
      firstContactMeans.id = undefined;
      firstContactMeans.contact = contact;
      firstContactMeans.isMain = true;
      contact.means = [firstContactMeans];
    }
    return contact;
  }
}

export class ContactReferenceDTO extends OmitType(ContactDTO, ['name', 'description'] as const) {}
