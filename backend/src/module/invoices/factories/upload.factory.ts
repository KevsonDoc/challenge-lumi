import { Request, Response } from 'express';
import { PdfAdapter } from '../adapters/pdf.adapter';
import { UploadInvoicesUseCase } from '../use-cases/upload-invoices.use-cases';
import { UploadInvoicesController } from '../controllers/upload-invoices.controllers';
import { InvoicesRepositories } from '../repositories/invoices.repositories';

export const uploadInvoicesFactory = (request: Request, response: Response) => {
  const pdfAdapter = new PdfAdapter();
  const invoiceRepositories = new InvoicesRepositories();
  const uploadInvoicesUseCase = new UploadInvoicesUseCase(
    pdfAdapter,
    invoiceRepositories,
  );
  const invoicesController = new UploadInvoicesController(
    uploadInvoicesUseCase,
  );

  return invoicesController.create(request, response);
};
