import { IInvoicesRepositoriesGatway } from '../gateways/invoices.repositories';

export class FindCustomersUseCase {
  constructor(
    private readonly invoicesRepositories: IInvoicesRepositoriesGatway,
  ) {}

  public async execute() {
    return this.invoicesRepositories.findCustomer();
  }
}
