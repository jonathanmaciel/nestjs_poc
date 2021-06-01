import { HttpException, HttpStatus } from "@nestjs/common";

export class ContactNameEqualException extends HttpException {

  static readonly STATUS: number = 508;

  constructor() {
    super({
      type: 'domain',
      status: ContactNameEqualException.STATUS, 
      message: 'O nome esta vinculado a outro contato.'
    }, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}