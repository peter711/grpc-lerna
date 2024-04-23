import { Server, ServerCredentials } from '@grpc/grpc-js';
import dotenv from 'dotenv';

import { RouteGuideService } from './protos/route_guide_grpc_pb';

import { createRouteGuideServer } from './servers';
import { RouteGuideService as GuideService } from './services';
import { InMemoryGuideRepository } from './repositories';

dotenv.config();

const port = process.env.GRPC_SERVER_PORT || 50051;
const uri = `0.0.0.0:${port}`;

export function createServer() {
  const server = new Server();

  console.log(`Listening on ${uri}`);

  server.addService(
    RouteGuideService,
    createRouteGuideServer(new GuideService(new InMemoryGuideRepository()))
  );

  server.bindAsync(uri, ServerCredentials.createInsecure(), (err) => {
    if (err) console.log(err);
  });

  return server;
}
