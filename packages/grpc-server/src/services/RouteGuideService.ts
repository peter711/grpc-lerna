import {
  DbFeature,
  DbMessage,
  DbPoint,
  IGuideRepository,
} from '../repositories/IGuideRepository';

export class RouteGuideService {
  private readonly COORD_FACTOR = 1e7;

  constructor(private repository: IGuideRepository) {}

  public checkFeature(point: DbPoint): DbFeature {
    const feature = this.repository.getFeature(point);
    return (
      feature || {
        name: '',
        location: {
          latitude: point.latitude,
          longitude: point.longitude,
        },
      }
    );
  }

  public listFeatures(lo: DbPoint, hi: DbPoint): Array<DbFeature> {
    const { top, right, left, bottom } = this.getBoundingRectangle(lo, hi);
    const featureList = this.repository.getAllFeatures();
    return featureList.filter((feature) => {
      if (!feature.name) return false;
      return (
        feature.location.longitude >= left &&
        feature.location.longitude <= right &&
        feature.location.latitude >= bottom &&
        feature.location.latitude <= top
      );
    });
  }

  public insertNote(point: DbPoint, message: DbMessage): void {
    this.repository.insertNote(point, message);
  }

  public getNotes(point: DbPoint): DbMessage[] {
    return this.repository.getNotes(point);
  }

  public recordRoute() {
    let point_count = 0;
    let feature_count = 0;
    let distance = 0;
    let previous: DbPoint | null = null;
    let start_time = process.hrtime();

    return (point: DbPoint) => {
      point_count += 1;
      if (this.checkFeature(point).name !== '') {
        feature_count += 1;
      }
      if (previous != null) {
        distance += this.getDistance(previous, point);
      }
      previous = point;

      return {
        point_count,
        feature_count,
        distance,
        start_time,
      };
    };
  }

  private getBoundingRectangle(
    lo: DbPoint,
    hi: DbPoint
  ): { top: number; left: number; right: number; bottom: number } {
    const left = Math.min(lo.longitude, hi.longitude);
    const right = Math.max(lo.longitude, hi.longitude);
    const top = Math.max(lo.latitude, hi.latitude);
    const bottom = Math.min(lo.latitude, hi.latitude);
    return {
      top,
      left,
      bottom,
      right,
    };
  }

  private getDistance(start: DbPoint, end: DbPoint) {
    function toRadians(num: number) {
      return (num * Math.PI) / 180;
    }

    var R = 6371000; // earth radius in metres
    var lat1 = toRadians(start.latitude / this.COORD_FACTOR);
    var lat2 = toRadians(end.latitude / this.COORD_FACTOR);
    var lon1 = toRadians(start.longitude / this.COORD_FACTOR);
    var lon2 = toRadians(end.longitude / this.COORD_FACTOR);

    var deltalat = lat2 - lat1;
    var deltalon = lon2 - lon1;
    var a =
      Math.sin(deltalat / 2) * Math.sin(deltalat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltalon / 2) *
        Math.sin(deltalon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
