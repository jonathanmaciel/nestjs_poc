import { HttpException, HttpStatus } from "@nestjs/common";

export class ContactMeansNameEqualException extends HttpException {

  static readonly STATUS: number = 509;

  constructor() {
    super({
      type: 'domain',
      status: ContactMeansNameEqualException.STATUS, 
      message: 'O nome esta vinculado a outro meio de contato.'
    }, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}