"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const grpc_js_1 = require("@grpc/grpc-js");
const dotenv_1 = __importDefault(require("dotenv"));
const route_guide_grpc_pb_1 = require("../../protos-types/dist/route_guide_grpc_pb");
const servers_1 = require("./servers");
const services_1 = require("./services");
const repositories_1 = require("./repositories");
dotenv_1.default.config();
const port = process.env.GRPC_SERVER_PORT || 9090;
const uri = `0.0.0.0:${port}`;
function createServer() {
    const server = new grpc_js_1.Server();
    console.log(`Listening on ${uri}`);
    server.addService(route_guide_grpc_pb_1.RouteGuideService, (0, servers_1.createRouteGuideServer)(new services_1.RouteGuideService(new repositories_1.InMemoryGuideRepository())));
    server.bindAsync(uri, grpc_js_1.ServerCredentials.createInsecure(), (err) => {
        if (err)
            console.log(err);
    });
    return server;
}
exports.createServer = createServer;
