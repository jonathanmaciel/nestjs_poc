import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { ContactBookService } from './contact.book.service';
import { ContactDTO, ContactPostDTO, ContactReferenceDTO } from './contact.dto';
import { ContactMeansDTO, ContactMeansPostDTO, ContactMeansReferenceDTO } from './contact.means.dto';
import { SettingsDTO } from './settings.dto';

@Controller("contacts/book")
export class ContactBookController {

  constructor(private readonly contactBookService: ContactBookService) {}

  @Get()
  list (): Promise<string> {
    return this.contactBookService.list();
  }

  @Get('/:id')
  listItem (@Param('id') id: number): Promise<string> {
    return this.contactBookService.listItem(id);
  }

  @Post()
  @HttpCode(201)
  add (@Body() contactPostDTO: ContactPostDTO): Promise<string> {
    return this.contactBookService.add(contactPostDTO);
  }

  @Put()
  @HttpCode(200)
  update (@Body() contactDTO: ContactDTO): Promise<string> {
    return this.contactBookService.put(contactDTO);
  }

  @Delete()
  @HttpCode(200)
  delete (@Body() contactReferenceDTO: ContactReferenceDTO): Promise<string> {
    return this.contactBookService.delete(contactReferenceDTO);
  }

  @Get('/means/:id')
  listContactMeans (@Param('id') id: number): Promise<string> {
    return this.contactBookService.listContactMeans(id);
  }

  @Post('/means')
  @HttpCode(201)
  addContactMeans (@Body() contactMeansPostDTO: ContactMeansPostDTO): Promise<string> {
    return this.contactBookService.addContactMeans(contactMeansPostDTO);
  }

  @Put('/means')
  @HttpCode(200)
  updateMean (@Body() contactMeansDTO: ContactMeansDTO): Promise<string> {
    return this.contactBookService.putContactMeans(contactMeansDTO);
  }

  @Delete('/means')
  @HttpCode(200)
  deleteContactMeans (@Body() contactMeansReferenceDTO: ContactMeansReferenceDTO): Promise<string> {
    return this.contactBookService.deleteContactMeans(contactMeansReferenceDTO);
  }

  @Get('/settings/:id')
  getSettings (@Param('id') id: string): Promise<string> {
    return this.contactBookService.getSettings(id);
  }

  @Put('/settings/')
  @HttpCode(200)
  putSettings (@Body() settingsDTO: SettingsDTO): Promise<string> {
    return this.contactBookService.putSettings(settingsDTO);
  }
}
