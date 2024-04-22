import fs from 'fs';

import {
  DbFeature,
  IGuideRepository,
  DbPoint,
  DbMessage,
} from './IGuideRepository';

export class InMemoryGuideRepository implements IGuideRepository {
  private readonly dbPath = __dirname + '/route_guide_db.json';
  private featureList: Array<DbFeature>;
  private notes: Map<string, Array<DbMessage>>;

  constructor() {
    const buff = fs.readFileSync(this.dbPath);
    const parsed = JSON.parse(buff.toString());
    this.featureList = parsed;
    this.notes = new Map();
  }

  insertNote(point: DbPoint, message: DbMessage): void {
    const key = this.getPointMessageKey(point);
    const notes = this.notes.get(key) || [];
    notes.push(message);
    this.notes.set(key, notes);
  }

  getNotes(point: DbPoint): DbMessage[] {
    const key = this.getPointMessageKey(point);
    return this.notes.get(key) || [];
  }

  getFeature(point: DbPoint): DbFeature | null {
    for (let i = 0; i < this.featureList.length; i++) {
      const feature = this.featureList[i];
      if (
        feature.location.latitude === point.latitude &&
        feature.location.longitude === point.longitude
      ) {
        return feature;
      }
    }
    return null;
  }

  getAllFeatures(): Array<DbFeature> {
    return this.featureList;
  }

  private getPointMessageKey(point: DbPoint): string {
    return `${point.latitude}_${point.longitude}`;
  }
}
