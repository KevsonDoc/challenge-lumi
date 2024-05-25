import { Router } from 'express';
import fileUpload from 'express-fileupload';
import { uploadInvoicesFactory } from '../../module/invoices/factories/upload.factory';

const invoicesRoutes = Router();

invoicesRoutes.post(
  '/',
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 },
  }),
  uploadInvoicesFactory,
);

export { invoicesRoutes };
