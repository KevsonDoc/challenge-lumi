import { HttpExeption } from '../../../infra/error/http-exeption';
import { IInvoicesRepositoriesGatway } from '../gateways/invoices.repositories';

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

export class FindInvoiceByCustomerNumberUseCase {
  constructor(
    private readonly invoicesRepositories: IInvoicesRepositoriesGatway,
  ) {}

  public async execute({
    customerNumber,
    year = 2023,
  }: {
    customerNumber: string;
    year: number;
  }) {
    if (Number.isNaN(year)) {
      throw new HttpExeption(['Ano inválido'], 422);
    }

    if (year >= new Date().getFullYear()) {
      throw new HttpExeption(['Ano inválido'], 422);
    }

    const invoices = await this.invoicesRepositories.findInvoicesByYear({
      customerNumber,
      year,
    });

    return invoices.map(
      ({
        referenceYear,
        electricityAmount,
        referenceMonth,
        SCEEEnergyWithoutICMSAmount,
        compensatedEnergyGDIAmount,
        electricityValue,
        SCEEEnergyWithoutICMSValue,
        publicLightingContribution,
      }) => ({
        referenceYear,
        referenceMonth: {
          value: referenceMonth,
          label: Object.keys(MonthEnum).find(
            key => MonthEnum[key as keyof typeof MonthEnum] === referenceMonth,
          ),
        },
        electricPowerConsumption:
          electricityAmount - SCEEEnergyWithoutICMSAmount,
        compensatedEnergy: compensatedEnergyGDIAmount,
        totalValueWithoutGD:
          electricityValue +
          SCEEEnergyWithoutICMSValue +
          publicLightingContribution,
      }),
    );
  }
}
