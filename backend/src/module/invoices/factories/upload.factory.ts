import { Request, Response } from 'express';
import { PdfAdapter } from '../adapters/pdf.adapter';
import { UploadInvoicesUseCase } from '../use-cases/upload-invoices.use-cases';
import { InvoicesController } from '../controllers/invoices.controllers';

export const uploadInvoicesFactory = (request: Request, response: Response) => {
  const pdfAdapter = new PdfAdapter();
  const uploadInvoicesUseCase = new UploadInvoicesUseCase(pdfAdapter);
  const invoicesController = new InvoicesController(uploadInvoicesUseCase);

  return invoicesController.create(request, response);
};
