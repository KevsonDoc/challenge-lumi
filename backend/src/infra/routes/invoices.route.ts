import { Router } from 'express';
import fileUpload from 'express-fileupload';
import { findCustomersFactory } from '../../module/invoices/factories/find-customers.factory';
import { findInvoiceByCustomerNumber } from '../../module/invoices/factories/find-invoice-by-customer-number.factory';
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

invoicesRoutes.get('/customers', findCustomersFactory);
invoicesRoutes.get('/:customerNumber', findInvoiceByCustomerNumber);

export { invoicesRoutes };
