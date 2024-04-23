import {
  Feature,
  Point,
  Rectangle,
} from '../protos/route_guide_pb';
import { COORD_FACTOR } from '../constants';
import { client } from '../services';

export function runListFeatures() {
  const rectangle = new Rectangle()
    .setLo(new Point().setLatitude(400000000).setLongitude(-750000000))
    .setHi(new Point().setLatitude(420000000).setLongitude(-730000000));

  const call = client.listFeatures(rectangle);
  call.on('data', (feature: Feature) => {
    const location = feature.getLocation();
    if (!location) return;
    console.log(
      'Found feature called "' +
        feature.getName() +
        '" at ' +
        location.getLatitude() / COORD_FACTOR +
        ', ' +
        location.getLongitude() / COORD_FACTOR
    );
  });
}
