import { useEffect } from 'react';

import { RouteGuideClient } from './protos/Route_guideServiceClientPb';
import * as Types from './protos/route_guide_pb';

import './App.css';

async function callGRPCService() {
  const EnvoyURL = 'http://localhost:8000';
  const client = new RouteGuideClient(EnvoyURL);
  const request = new Types.Point();
  await client.getFeature(request, {});
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
