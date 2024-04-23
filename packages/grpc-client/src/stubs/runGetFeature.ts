import { Point } from '../protos//route_guide_pb';
import { COORD_FACTOR } from '../constants';
import { client } from '../services';

export function runGetFeature() {
  [
    {
      latitude: 409146138,
      longitude: -746188906,
    },
    {
      latitude: 0,
      longitude: 0,
    },
  ].forEach((point) =>
    client.getFeature(
      new Point().setLatitude(point.latitude).setLongitude(point.longitude),
      (err, feature) => {
        if (err) throw err;

        const location = feature.getLocation();
        if (!location) return;

        if (feature.getName() === '') {
          console.log(
            'Found no feature at ' +
              location.getLatitude() / COORD_FACTOR +
              ', ' +
              location.getLongitude() / COORD_FACTOR
          );
        } else {
          console.log(
            'Found feature called "' +
              feature.getName() +
              '" at ' +
              location.getLatitude() / COORD_FACTOR +
              ', ' +
              location.getLongitude() / COORD_FACTOR
          );
        }
      }
    )
  );
}
