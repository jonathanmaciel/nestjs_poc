import { HttpException, HttpStatus } from "@nestjs/common";

export class ContactMeansMainRemovedException extends HttpException {

  static readonly STATUS: number = 506;

  constructor() {
    super({
      type: 'domain',
      status: ContactMeansMainRemovedException.STATUS, 
      message: 'Voce esta tentando remover o meio de contato principal para este contato, selecione outro e tente novamente.'
    }, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}