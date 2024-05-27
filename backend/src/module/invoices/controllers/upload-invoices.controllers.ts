import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { HttpExeption } from '../../../infra/error/http-exeption';
import { UploadInvoicesUseCase } from '../use-cases/upload-invoices.use-cases';

export class UploadInvoicesController {
  constructor(private readonly uploadInvoicesUseCase: UploadInvoicesUseCase) {}

  public async create(request: Request, response: Response) {
    const invoicesFiles = request.files?.invoicesFiles as
      | UploadedFile[]
      | undefined;

    if (invoicesFiles === undefined) {
      throw new HttpExeption(['Compo arquivo é obrigatório'], 422);
    }

    if (
      invoicesFiles.find(
        invoicesFileItem => invoicesFileItem.size >= 3 * 1024 * 1024,
      )
    ) {
      throw new HttpExeption(['Arquivo deve ter no máximo 2 MB'], 422);
    }

    const data = await this.uploadInvoicesUseCase.execute(invoicesFiles);

    return response.json(data).status(201);
  }
}
