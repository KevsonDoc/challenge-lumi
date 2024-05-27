import { config } from 'dotenv';
import express, { Express, NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { HttpExeption } from '../error/http-exeption';
import { route } from '../routes';

export class Server {
  private app: Express;

  constructor() {
    this.app = express();
  }

  public static loadEnvs(): void {
    config({ path: `.env.${process.env.NODE_ENV ?? 'production'}` });
  }

  public async start(): Promise<void> {
    const port = Number(process.env.APP_PORT);

    this.app.use(express.json());
    this.app.use('/api', route);
    this.app.use(
      (error: unknown, _: Request, response: Response, next: NextFunction) => {
        if (error instanceof HttpExeption) {
          return response.status(error.httpStatusCode).json({
            message: error.messages,
          });
        }

        if (error instanceof Error) {
          console.error(error);
          return response.status(500).json({
            message: 'Erro no servidor',
          });
        }

        return next();
      },
    );

    this.app.listen(port, () => {
      console.info('Server is running');
      console.info(`Server port: ${port}`);
    });
  }
}
