import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://neieadeveloper_db_user:NEIEA%401234@cluster0.udnix8p.mongodb.net/neiea";

const OLD_URL = "https://neiea-ngo.s3.ap-south-1.amazonaws.com";
const NEW_URL = "https://neiea.s3.ap-south-1.amazonaws.com";

// PURE recursive replacer
function replaceInValue(value) {
  if (typeof value === "string") {
    return value.includes(OLD_URL)
      ? value.replaceAll(OLD_URL, NEW_URL)
      : value;
  }

  if (Array.isArray(value)) {
    return value.map(replaceInValue);
  }

  if (value && typeof value === "object") {
    const newObj = {};
    for (const key of Object.keys(value)) {
      newObj[key] = replaceInValue(value[key]);
    }
    return newObj;
  }

  return value;
}

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to DB");

  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    const cursor = collection.find({});
    let updatedCount = 0;

    while (await cursor.hasNext()) {
      const doc = await cursor.next();

      // convert to plain object
      const plainDoc = JSON.parse(JSON.stringify(doc));

      const updatedDoc = replaceInValue(plainDoc);

      // 🔥 REMOVE _id (immutable)
      delete updatedDoc._id;

      if (JSON.stringify(plainDoc) !== JSON.stringify({ ...updatedDoc, _id: doc._id })) {
        await collection.updateOne(
          { _id: doc._id },
          { $set: updatedDoc }
        );
        updatedCount++;
      }
    }

    if (updatedCount > 0) {
      console.log(
        `Updated ${updatedCount} documents in ${collection.collectionName}`
      );
    }
  }

  console.log("✅ URL replacement completed successfully");
  process.exit(0);
}

run().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
