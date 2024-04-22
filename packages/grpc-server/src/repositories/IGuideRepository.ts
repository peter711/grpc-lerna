export interface IGuideRepository {
  getFeature(point: DbPoint): DbFeature | null;
  getAllFeatures(): Array<DbFeature>;
  insertNote(point: DbPoint, message: DbMessage): void;
  getNotes(point: DbPoint): Array<DbMessage>;
}

export interface DbPoint {
  latitude: number;
  longitude: number;
}

export interface DbFeature {
  location: DbPoint;
  name: string;
}

export interface DbMessage {
  message: string;
}
