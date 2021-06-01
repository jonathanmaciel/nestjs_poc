import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './contact/contact';
import { ContactBookController } from './contact/contact.book.controller';
import { ContactBookService } from './contact/contact.book.service';
import { ContactBookModule } from './contact/contact.book.module';
import { ContactMeans } from './contact/contact.means';
import { Settings } from './contact/settings';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.sqlite',
      entities: [Contact, ContactMeans, Settings],
      synchronize: false
    }), ContactBookModule
  ],
  controllers: [AppController, ContactBookController],
  providers: [AppService, ContactBookService]
})
export class AppModule {}
