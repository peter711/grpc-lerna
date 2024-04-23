import grpc from '@grpc/grpc-js';

import { IRouteGuideServer } from '../protos/route_guide_grpc_pb';
import {
  Point,
  Feature,
  Rectangle,
  RouteSummary,
  RouteNote,
} from '../protos/route_guide_pb';

import { RouteGuideService } from '../services';

export const createRouteGuideServer = (
  routeGuideService: RouteGuideService
): IRouteGuideServer => ({
  getFeature: function (
    call: grpc.ServerUnaryCall<Point, Feature>,
    callback: grpc.sendUnaryData<Feature>
  ): void {
    const result = new Feature();
    const point = call.request.toObject();

    const dbFeature = routeGuideService.checkFeature(point);
    if (!dbFeature) {
      result.setName('').setLocation(call.request);
      callback(null, result);
      return;
    }

    result
      .setName(dbFeature.name)
      .setLocation(
        new Point()
          .setLatitude(dbFeature.location.latitude)
          .setLongitude(dbFeature.location.longitude)
      );
    callback(null, result);
  },
  listFeatures: function (
    call: grpc.ServerWritableStream<Rectangle, Feature>
  ): void {
    const rectangle = call.request.toObject();
    if (!rectangle.hi || !rectangle.lo)
      throw new Error('Wrong rectangle shape request');

    const featuresList = routeGuideService.listFeatures(
      rectangle.lo,
      rectangle.hi
    );
    featuresList.forEach((feature) => {
      call.write(
        new Feature()
          .setLocation(
            new Point()
              .setLatitude(feature.location.latitude)
              .setLongitude(feature.location.longitude)
          )
          .setName(feature.name)
      );
    });
    call.end();
  },
  recordRoute: function (
    call: grpc.ServerReadableStream<Point, RouteSummary>,
    callback: grpc.sendUnaryData<RouteSummary>
  ): void {
    const record = routeGuideService.recordRoute();
    const summary = new RouteSummary();

    call.on('data', (point: Point) => {
      const { distance, feature_count, point_count, start_time } = record(
        point.toObject()
      );
      summary
        .setDistance(distance | 0)
        .setFeatureCount(feature_count)
        .setPointCount(point_count)
        .setElapsedTime(process.hrtime(start_time)[0]);
    });

    call.on('end', () => {
      callback(null, summary);
    });
  },
  routeChat: function (
    call: grpc.ServerDuplexStream<RouteNote, RouteNote>
  ): void {
    call.on('data', (note: RouteNote) => {
      const { location, message } = note.toObject();
      if (!location) throw new Error('Location is undefined');
      const currentNotes = routeGuideService.getNotes(location);
      currentNotes.forEach((currentNote) =>
        call.write(new RouteNote().setMessage(currentNote.message))
      );
      routeGuideService.insertNote(location, { message });
    });

    call.on('end', () => {
      call.end();
    });
  },
});
