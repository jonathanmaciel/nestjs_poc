import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { ContactBookService } from './contact.book.service';
import { ContactDTO } from './contact.dto';
import { SettingsDTO } from './settings.dto';

@Controller("contacts/book")
export class ContactBookController {

  constructor(private readonly contactBookService: ContactBookService) {}

  @Get()
  list (): Promise<string> {
    return this.contactBookService.list();
  }

  @Get(':id')
  listId (@Param('id') id: number): Promise<string> {
    return this.contactBookService.listId(id);
  }

  @Post()
  @HttpCode(201)
  add (@Body() contactDTO: ContactDTO): Promise<string> {
    return this.contactBookService.add(contactDTO);
  }

  @Put()
  @HttpCode(200)
  update (@Body() contactDTO: ContactDTO): Promise<string> {
    return this.contactBookService.put(contactDTO);
  }

  @Delete()
  @HttpCode(200)
  delete (@Body() contactDTO: ContactDTO): Promise<string> {
    return this.contactBookService.delete(contactDTO);
  }

  @Get('/mean/:id')
  listContactMeans (@Param('id') id: number): Promise<string> {
    return this.contactBookService.listContactMeans(id);
  }

  @Post('/mean')
  @HttpCode(201)
  addContactMeans (@Body() mean): Promise<string> {
    return this.contactBookService.addContactMeans(mean);
  }

  @Put('/mean')
  @HttpCode(200)
  updateMean (@Body() contactMeansDTO): Promise<string> {
    return this.contactBookService.putContactMeans(contactMeansDTO);
  }

  @Delete('/mean')
  @HttpCode(200)
  deleteContactMeans (@Body() contactMeansDTO): Promise<string> {
    return this.contactBookService.deleteContactMeans(contactMeansDTO);
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
