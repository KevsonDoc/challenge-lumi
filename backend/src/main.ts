import { Server } from './infra/server';

Server.loadEnvs();

async function main(): Promise<void> {
  const server = new Server();

  await server.start();
}

main();
