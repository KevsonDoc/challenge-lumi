import { Request, Response } from 'express';
import { FindInvoiceByCustomerNumberUseCase } from '../use-cases/find-invoices-by-customer-number.use-cases';

export class FindInvoicesByCustomerNumberController {
  constructor(
    private readonly findInvoiceByCustomerNumber: FindInvoiceByCustomerNumberUseCase,
  ) {}

  public async execute(request: Request, response: Response) {
    const customerNumber = request.params.customerNumber;
    const year = Number(request.query?.year);
    const invoices = await this.findInvoiceByCustomerNumber.execute({
      customerNumber,
      year,
    });
    return response.json(invoices).status(200);
  }
}
