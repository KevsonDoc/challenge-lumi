import { Request, Response } from 'express';
import { FindInvoicesByCustomerNumberController } from '../controllers/find-invoices-by-customer-number.controllers';
import { FindInvoiceByCustomerNumberUseCase } from '../use-cases/find-invoices-by-customer-number.use-cases';
import { InvoicesRepositories } from '../repositories/invoices.repositories';

export const findInvoiceByCustomerNumber = (
  request: Request,
  response: Response,
) => {
  const invoicesRepositories = new InvoicesRepositories();
  const findInvoiceByCustomerNumber = new FindInvoiceByCustomerNumberUseCase(
    invoicesRepositories,
  );
  const findInvoicesByCustomerNumberController =
    new FindInvoicesByCustomerNumberController(findInvoiceByCustomerNumber);

  return findInvoicesByCustomerNumberController.execute(request, response);
};
