"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const MONGO_URI = `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@localhost:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;
const uri = "mongodb://todoRoot:todoApplication@localhost:27017/tododb?authSource=admin";
const dbName = "tododb";
function migrateIdsToObjectId() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new mongodb_1.MongoClient(uri);
        try {
            yield client.connect();
            const db = client.db(dbName);
            const tasksCollection = db.collection("tasks");
            // Find all tasks where _id is a string
            const stringIdTasks = yield tasksCollection
                .find({ _id: { $type: "string" } })
                .toArray();
            for (const oldTask of stringIdTasks) {
                const { _id } = oldTask, rest = __rest(oldTask, ["_id"]);
                // Insert new document with ObjectId
                const newId = new mongodb_1.ObjectId(_id);
                yield tasksCollection.insertOne(Object.assign({ _id: newId }, rest));
                // Remove the old document
                yield tasksCollection.deleteOne({ _id });
            }
            console.log(`✅ Migrated ${stringIdTasks.length} tasks to use ObjectId`);
        }
        catch (err) {
            console.error("❌ Migration failed:", err);
        }
        finally {
            yield client.close();
        }
    });
}
migrateIdsToObjectId();
