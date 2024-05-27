export interface IInvoicesModel {
  id: string;
  customerNumber: string;
  name: string;
  referenceMonth: number;
  referenceYear: number;
  electricityAmount: number;
  electricityUnitPrice: number;
  electricityValue: number;
  SCEEEnergyWithoutICMSAmount: number;
  SCEEEnergyWithoutICMSUnitPrice: number;
  SCEEEnergyWithoutICMSValue: number;
  compensatedEnergyGDIAmount: number;
  compensatedEnergyGDIUnitPrice: number;
  compensatedEnergyGDIValue: number;
  publicLightingContribution: number;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomer {
  customerNumber: string;
  name: string;
}

export interface IInvoicesRepositoriesGatway {
  findInvoices(params: {
    customerNumber: string;
    month: number;
    year: number;
  }): Promise<IInvoicesModel | null>;
  findInvoicesByYear(query: {
    customerNumber: string;
    year: number;
  }): Promise<IInvoicesModel[]>;
  findCustomer(): Promise<ICustomer[]>;

  save(invoice: Partial<IInvoicesModel>): Promise<void>;
  update(id: string, invoice: Partial<IInvoicesModel>): Promise<void>;
}
