import { credentials } from '@grpc/grpc-js';
import dotenv from 'dotenv';

import { RouteGuideClient } from '../protos/route_guide_grpc_pb';

dotenv.config();

const url = `${process.env.GRPC_SERVER_HOST}:${process.env.GRP_SERVER_PORT}`;

export const client = new RouteGuideClient(url, credentials.createInsecure());
