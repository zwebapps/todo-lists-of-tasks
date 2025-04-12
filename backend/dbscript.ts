import { MongoClient, ObjectId } from "mongodb";

const MONGO_URI=`mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@localhost:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;


const uri = "mongodb://todoRoot:todoApplication@localhost:27017/tododb?authSource=admin";
const dbName = "tododb";

async function migrateIdsToObjectId() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const tasksCollection = db.collection("tasks");

    // Find all tasks where _id is a string
    const stringIdTasks = await tasksCollection
      .find({ _id: { $type: "string" } })
      .toArray();

    for (const oldTask of stringIdTasks) {
      const { _id, ...rest } = oldTask;

      // Insert new document with ObjectId
      const newId = new ObjectId(_id);
      await tasksCollection.insertOne({ _id: newId, ...rest });

      // Remove the old document
      await tasksCollection.deleteOne({ _id });
    }

    console.log(`✅ Migrated ${stringIdTasks.length} tasks to use ObjectId`);
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    await client.close();
  }
}

migrateIdsToObjectId();
