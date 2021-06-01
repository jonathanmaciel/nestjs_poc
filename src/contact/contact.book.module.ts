import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactBookController } from './contact.book.controller';
import { ContactBookService } from './contact.book.service';
import { Contact } from './contact';
import { ContactMeans } from './contact.means';
import { Settings } from './settings';

@Module({
  imports: [TypeOrmModule.forFeature([Contact, ContactMeans, Settings])],
  providers: [ContactBookService],
  controllers: [ContactBookController],
  exports: [TypeOrmModule]
})
export class ContactBookModule {}
