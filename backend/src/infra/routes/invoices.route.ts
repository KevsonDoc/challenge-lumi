import { Router } from 'express';
import { InvoicesController } from '../../module/invoices/controllers/invoices.controllers';
import fileUpload from 'express-fileupload';
import { UploadInvoicesUseCase } from '../../module/invoices/use-cases/upload-invoices.use-cases';
import { PdfAdapter } from '../../module/invoices/adapters/pdf.adapter';

const invoicesRoutes = Router();

const pdfAdapter = new PdfAdapter();
const uploadInvoicesUseCase = new UploadInvoicesUseCase(pdfAdapter);
const invoicesController = new InvoicesController(uploadInvoicesUseCase);

invoicesRoutes.post(
  '/',
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 },
  }),
  invoicesController.create,
);

export { invoicesRoutes };
