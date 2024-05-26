import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { HttpExeption } from '../../../infra/error/http-exeption';
import { UploadInvoicesUseCase } from '../use-cases/upload-invoices.use-cases';

export class InvoicesController {
  constructor(private readonly uploadInvoicesUseCase: UploadInvoicesUseCase) {}

  public async create(request: Request, response: Response) {
    const invoicesFiles = request.files?.invoicesFiles as UploadedFile[];

    if (
      invoicesFiles.find(
        invoicesFileItem => invoicesFileItem.size >= 3 * 1024 * 1024,
      )
    ) {
      throw new HttpExeption(['Arquivo deve ter no máximo 2 MB'], 422);
    }

    const data = await this.uploadInvoicesUseCase.execute(invoicesFiles);

    return response.json(data);
  }
}
