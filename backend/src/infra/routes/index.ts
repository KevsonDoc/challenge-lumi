import { Router } from 'express';
import { invoicesRoutes } from './invoices.route';

const route = Router();

route.use('/invoices', invoicesRoutes);

export { route };
