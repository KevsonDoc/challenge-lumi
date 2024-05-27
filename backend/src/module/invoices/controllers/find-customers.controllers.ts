import { Request, Response } from 'express';
import { FindCustomersUseCase } from '../use-cases/find-customers.use-case';

export class FindCustomersControllers {
  constructor(private readonly findCustomersUseCase: FindCustomersUseCase) {}

  public async handle(_request: Request, response: Response) {
    const data = await this.findCustomersUseCase.execute();

    return response.json(data).status(200);
  }
}
