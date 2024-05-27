import { Database } from '../../../infra/database';
import {
  ICustomer,
  IInvoicesModel,
  IInvoicesRepositoriesGatway,
} from '../gateways/invoices.repositories';

export class InvoicesRepositories implements IInvoicesRepositoriesGatway {
  public async findInvoices(query: {
    customerNumber: string;
    month: number;
    year: number;
  }): Promise<IInvoicesModel | null> {
    const database = new Database();

    return database.prisma.invoices.findFirst({
      where: {
        customerNumber: query.customerNumber,
        referenceMonth: query.month,
        referenceYear: query.year,
      },
    });
  }

  public async save(invoice: IInvoicesModel): Promise<void> {
    const database = new Database();
    await database.prisma.invoices.create({
      data: invoice,
    });
  }

  public async update(
    id: string,
    invoice: Partial<IInvoicesModel>,
  ): Promise<void> {
    const database = new Database();
    await database.prisma.invoices.update({
      where: {
        id,
      },
      data: invoice,
    });
  }

  public async findInvoicesByYear(query: {
    customerNumber: string;
    year: number;
  }): Promise<IInvoicesModel[]> {
    const database = new Database();

    return database.prisma.invoices.findMany({
      where: {
        customerNumber: query.customerNumber,
        referenceYear: query.year,
      },
    });
  }

  public async findCustomer(): Promise<ICustomer[]> {
    const database = new Database();
    const customer = await database.prisma.invoices.findMany({
      distinct: ['customerNumber'],
    });

    return customer.map(({ customerNumber, name }) => ({
      customerNumber,
      name,
    }));
  }
}
