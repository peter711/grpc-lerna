"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryGuideRepository = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class InMemoryGuideRepository {
    constructor() {
        this.dbPath = path_1.default.join(__dirname + '/../assets/route_guide_db.json');
        const buff = fs_1.default.readFileSync(this.dbPath);
        const parsed = JSON.parse(buff.toString());
        this.featureList = parsed;
        this.notes = new Map();
    }
    insertNote(point, message) {
        const key = this.getPointMessageKey(point);
        const notes = this.notes.get(key) || [];
        notes.push(message);
        this.notes.set(key, notes);
    }
    getNotes(point) {
        const key = this.getPointMessageKey(point);
        return this.notes.get(key) || [];
    }
    getFeature(point) {
        for (let i = 0; i < this.featureList.length; i++) {
            const feature = this.featureList[i];
            if (feature.location.latitude === point.latitude &&
                feature.location.longitude === point.longitude) {
                return feature;
            }
        }
        return null;
    }
    getAllFeatures() {
        return this.featureList;
    }
    getPointMessageKey(point) {
        return `${point.latitude}_${point.longitude}`;
    }
}
exports.InMemoryGuideRepository = InMemoryGuideRepository;
