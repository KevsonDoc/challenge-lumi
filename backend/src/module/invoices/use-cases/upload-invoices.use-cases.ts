import { HttpExeption } from '../../../infra/error/http-exeption';
import { IPdfGateway } from '../gateways/pdf.gateway';

export class UploadInvoicesUseCase {
  constructor(private readonly pdfAdapter: IPdfGateway) {}

  private convertStringToNumber(value: string): number {
    const convertedNumber = +value.replace('.', '').replace(',', '.');

    if (Number.isNaN(convertedNumber)) {
      throw new HttpExeption(['Falha ao converter números'], 400);
    }

    return convertedNumber;
  }

  public async execute() {}
}
