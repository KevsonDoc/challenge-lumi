import { UploadedFile } from 'express-fileupload';
import path from 'path';
import { HttpExeption } from '../../../infra/error/http-exeption';
import { IPdfGateway } from '../gateways/pdf.gateway';

const MonthEnum = {
  JAN: 1,
  FEV: 2,
  MAR: 3,
  ABR: 4,
  MAI: 5,
  JUN: 6,
  JUL: 7,
  AGO: 8,
  SET: 9,
  OUT: 10,
  NOV: 11,
  DEZ: 12,
} as const;

export class UploadInvoicesUseCase {
  constructor(private readonly pdfAdapter: IPdfGateway) {}

  private convertStringToNumber(value: string): number {
    const convertedNumber = +value.replace('.', '').replace(',', '.');

    if (Number.isNaN(convertedNumber)) {
      throw new HttpExeption(['Falha ao converter números'], 400);
    }

    return convertedNumber;
  }

  private async moveToLocalStorage(pdfFiles: UploadedFile[]): Promise<void> {
    await Promise.all(
      pdfFiles.map(pdfFileItem => {
        const clientFilePath = path.join(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'public',
          'uploads',
        );

        return pdfFileItem.mv(clientFilePath);
      }),
    );
  }

  private async dataNormalization(pdfBuffer: Buffer[]) {
    const pdfs = await Promise.all(
      pdfBuffer.map(pdfItem => this.pdfAdapter.extract(pdfItem)),
    );

    return pdfs.map(invoiceItem => {
      const splitText = invoiceItem.text.split('\n');
      console.log(splitText.map((text, index) => `${index} | ${text}`));
      const [referenceMonth, referenceYear] = splitText[40]
        .trimStart()
        .trimEnd()
        .split(/\s+/)[0]
        .split('/');
      const electricity = splitText[5].trimStart().trimEnd().split(/\s+/);
      const SCEEEnergyWithoutICMS = splitText[6]
        .trimStart()
        .trimEnd()
        .split(/\s+/);
      const compensatedEnergyGDI = splitText[7]
        .trimStart()
        .trimEnd()
        .split(/\s+/);

      return {
        customerNumber: splitText[38].trimStart().split(/\s+/)[0],
        referenceMonth: MonthEnum[referenceMonth as keyof typeof MonthEnum],
        referenceYear: this.convertStringToNumber(referenceYear),
        electricity: {
          amount: this.convertStringToNumber(electricity[2]),
          unitPrice: this.convertStringToNumber(electricity[3]),
          value: this.convertStringToNumber(electricity[4]),
        },
        SCEEEnergyWithoutICMS: {
          amount: this.convertStringToNumber(SCEEEnergyWithoutICMS[4]),
          unitPrice: this.convertStringToNumber(SCEEEnergyWithoutICMS[5]),
          value: this.convertStringToNumber(SCEEEnergyWithoutICMS[6]),
        },
        compensatedEnergyGDI: {
          amount: this.convertStringToNumber(compensatedEnergyGDI[4]),
          unitPrice: this.convertStringToNumber(compensatedEnergyGDI[5]),
          value: this.convertStringToNumber(compensatedEnergyGDI[6]),
        },
        contribMunicipalPublicLight: this.convertStringToNumber(
          splitText[8].trimStart().trimEnd().split(/\s+/)[4],
        ),
      };
    });
  }

  public async execute(pdfFiles: UploadedFile[]) {
    await this.moveToLocalStorage(pdfFiles);
    return this.dataNormalization(pdfFiles.map(({ data }) => data));
  }
}
