import { PrismaClient } from '@prisma/client';

export class Database {
  public readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
}
