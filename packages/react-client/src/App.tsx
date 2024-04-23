import { useEffect } from 'react';
import { credentials } from '@grpc/grpc-js';

import { RouteGuideClient } from './protos/route_guide_grpc_pb.js';
// import { Point } from './protos/route_guide_pb';

import './App.css';

function callGRPCService() {
  const EnvoyURL = 'http://localhost:8000';
  const client = new RouteGuideClient(EnvoyURL, credentials.createInsecure());
  // client.getFeature(
  //   new Point().setLatitude(409146138).setLongitude(-746188906),
  //   (err, feature) => {
  //     if (err) throw err;
  //     console.log(feature);
  //   }
  // );
}

function App() {
  useEffect(() => {
    callGRPCService();
  }, []);
  return <span>React gRPC Client App</span>;
}

export default App;
