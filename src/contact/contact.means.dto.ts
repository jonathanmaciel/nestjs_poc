import { OmitType } from "@nestjs/mapped-types";
import { plainToClass, Type } from "class-transformer";
import { IsInt, IsNotEmpty, Min, ValidateNested } from "class-validator";
import { ContactReferenceDTO } from "./contact.dto";
import { ContactMeans } from "./contact.means";

export class ContactMeansDTO {

  @IsNotEmpty({message: 'contact means dto id is required'})
  @IsInt({message: 'contact means dto id is int'})
  @Min(1, {message: 'contact means dto id is greater than 1'})
  id: number;

  @IsNotEmpty({message: 'contact means dto name required'})
  name: string;

  @IsNotEmpty({message: 'contact means dto value required'})
  value: string;

  @IsNotEmpty({message: 'contact means dto main required'})
  isMain: Boolean;

  @ValidateNested({each: true})
  @Type(()=> ContactReferenceDTO)
  contact: ContactReferenceDTO;

  asContactMeans(): ContactMeans {
    return plainToClass(ContactMeans, this);
  }
}

export class ContactMeansCascadePostDTO extends OmitType(ContactMeansDTO, ['id', 'contact'] as const) {

  asNewContactMeans(): ContactMeans {
    const contactMeans: ContactMeans = plainToClass(ContactMeans, this);
    contactMeans.id = undefined;
    return contactMeans;
  }
}

export class ContactMeansPostDTO extends OmitType(ContactMeansDTO, ['id'] as const) {

  asNewContactMeans(): ContactMeans {
    const contactMeans: ContactMeans = plainToClass(ContactMeans, this);
    contactMeans.id = undefined;
    return contactMeans;
  }
}

export class ContactMeansReferenceDTO extends OmitType(ContactMeansDTO, ['name', 'value', 'isMain', 'contact'] as const) {}
