"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouteGuideServer = void 0;
const route_guide_pb_1 = require("protos-types/dist/route_guide_pb");
const createRouteGuideServer = (routeGuideService) => ({
    getFeature: function (call, callback) {
        const result = new route_guide_pb_1.Feature();
        const point = call.request.toObject();
        const dbFeature = routeGuideService.checkFeature(point);
        if (!dbFeature) {
            result.setName('').setLocation(call.request);
            callback(null, result);
            return;
        }
        result
            .setName(dbFeature.name)
            .setLocation(new route_guide_pb_1.Point()
            .setLatitude(dbFeature.location.latitude)
            .setLongitude(dbFeature.location.longitude));
        callback(null, result);
    },
    listFeatures: function (call) {
        const rectangle = call.request.toObject();
        if (!rectangle.hi || !rectangle.lo)
            throw new Error('Wrong rectangle shape request');
        const featuresList = routeGuideService.listFeatures(rectangle.lo, rectangle.hi);
        featuresList.forEach((feature) => {
            call.write(new route_guide_pb_1.Feature()
                .setLocation(new route_guide_pb_1.Point()
                .setLatitude(feature.location.latitude)
                .setLongitude(feature.location.longitude))
                .setName(feature.name));
        });
        call.end();
    },
    recordRoute: function (call, callback) {
        const record = routeGuideService.recordRoute();
        const summary = new route_guide_pb_1.RouteSummary();
        call.on('data', (point) => {
            const { distance, feature_count, point_count, start_time } = record(point.toObject());
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
    routeChat: function (call) {
        call.on('data', (note) => {
            const { location, message } = note.toObject();
            if (!location)
                throw new Error('Location is undefined');
            const currentNotes = routeGuideService.getNotes(location);
            currentNotes.forEach((currentNote) => call.write(new route_guide_pb_1.RouteNote().setMessage(currentNote.message)));
            routeGuideService.insertNote(location, { message });
        });
        call.on('end', () => {
            call.end();
        });
    },
});
exports.createRouteGuideServer = createRouteGuideServer;
