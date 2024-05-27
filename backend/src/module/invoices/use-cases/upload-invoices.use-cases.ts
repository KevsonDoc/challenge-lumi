import { UploadedFile } from 'express-fileupload';
import path from 'path';
import * as uuid from 'uuid';
import { HttpExeption } from '../../../infra/error/http-exeption';
import { IInvoicesRepositoriesGatway } from '../gateways/invoices.repositories';
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
  constructor(
    private readonly pdfAdapter: IPdfGateway,
    private readonly invoiceRepositories: IInvoicesRepositoriesGatway,
  ) {}

  private convertStringToNumber(value: string): number {
    const convertedNumber = +value.replace('.', '').replace(',', '.');

    if (Number.isNaN(convertedNumber)) {
      throw new HttpExeption(['Falha ao converter números'], 400);
    }

    return convertedNumber;
  }

  private async dataNormalization(pdfBuffer: Buffer) {
    const invoice = await this.pdfAdapter.extract(pdfBuffer);

    const splitText = invoice.text.split('\n');
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
      name: splitText[32].trimStart().trimEnd(),
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
      publicLightingContribution: this.convertStringToNumber(
        splitText[8].trimStart().trimEnd().split(/\s+/)[4],
      ),
    };
  }

  public async execute(pdfFiles: UploadedFile[]) {
    for await (const pdfFile of pdfFiles) {
      const normalizedData = await this.dataNormalization(pdfFile.data);
      const invoice = await this.invoiceRepositories.findInvoices({
        customerNumber: normalizedData.customerNumber,
        month: normalizedData.referenceMonth,
        year: normalizedData.referenceYear,
      });

      const pathFile = path.join(
        'public',
        'uploads',
        'invoices',
        normalizedData.customerNumber,
        uuid.v4(),
      );

      if (invoice) {
        await this.invoiceRepositories.update(invoice.id, {
          name: normalizedData.name,
          referenceMonth: normalizedData.referenceMonth,
          referenceYear: normalizedData.referenceYear,
          electricityAmount: normalizedData.electricity.amount,
          electricityUnitPrice: normalizedData.electricity.unitPrice,
          electricityValue: normalizedData.electricity.value,
          SCEEEnergyWithoutICMSAmount:
            normalizedData.SCEEEnergyWithoutICMS.amount,
          SCEEEnergyWithoutICMSUnitPrice:
            normalizedData.SCEEEnergyWithoutICMS.unitPrice,
          SCEEEnergyWithoutICMSValue:
            normalizedData.SCEEEnergyWithoutICMS.value,
          compensatedEnergyGDIAmount:
            normalizedData.compensatedEnergyGDI.amount,
          compensatedEnergyGDIUnitPrice:
            normalizedData.compensatedEnergyGDI.unitPrice,
          compensatedEnergyGDIValue: normalizedData.compensatedEnergyGDI.value,
          publicLightingContribution: normalizedData.publicLightingContribution,
          path: pathFile,
        });
        await pdfFile.mv(pathFile);
      } else {
        await this.invoiceRepositories.save({
          customerNumber: normalizedData.customerNumber,
          name: normalizedData.name,
          referenceMonth: normalizedData.referenceMonth,
          referenceYear: normalizedData.referenceYear,
          electricityAmount: normalizedData.electricity.amount,
          electricityUnitPrice: normalizedData.electricity.unitPrice,
          electricityValue: normalizedData.electricity.value,
          SCEEEnergyWithoutICMSAmount:
            normalizedData.SCEEEnergyWithoutICMS.amount,
          SCEEEnergyWithoutICMSUnitPrice:
            normalizedData.SCEEEnergyWithoutICMS.unitPrice,
          SCEEEnergyWithoutICMSValue:
            normalizedData.SCEEEnergyWithoutICMS.value,
          compensatedEnergyGDIAmount:
            normalizedData.compensatedEnergyGDI.amount,
          compensatedEnergyGDIUnitPrice:
            normalizedData.compensatedEnergyGDI.unitPrice,
          compensatedEnergyGDIValue: normalizedData.compensatedEnergyGDI.value,
          publicLightingContribution: normalizedData.publicLightingContribution,
          path: pathFile,
        });
        await pdfFile.mv(pathFile);
      }
    }
    return { message: ['Upload de arquivo concluído'] };
  }
}
