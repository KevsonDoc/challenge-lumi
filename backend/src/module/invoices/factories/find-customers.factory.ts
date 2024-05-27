import { Request, Response } from 'express';
import { FindCustomersControllers } from '../controllers/find-customers.controllers';
import { InvoicesRepositories } from '../repositories/invoices.repositories';
import { FindCustomersUseCase } from '../use-cases/find-customers.use-case';

export const findCustomersFactory = (request: Request, response: Response) => {
  const invoicesRepositories = new InvoicesRepositories();
  const findCUstomersUseCase = new FindCustomersUseCase(invoicesRepositories);
  const findCustomersController = new FindCustomersControllers(
    findCUstomersUseCase,
  );
  return findCustomersController.handle(request, response);
};
