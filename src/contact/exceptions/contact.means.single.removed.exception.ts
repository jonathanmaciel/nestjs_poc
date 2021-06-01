import { HttpException, HttpStatus } from "@nestjs/common";

export class ContactMeansSingleRemovedException extends HttpException {

  static readonly STATUS: number = 507;

  constructor() {
    super({
      type: 'domain',
      status: ContactMeansSingleRemovedException.STATUS, 
      message: 'Voce esta tentando remover o ultimo meio de contato para este contato, deseja excluir esse contato?'
    }, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}