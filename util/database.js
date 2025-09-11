import { MongoClient } from "mongodb";
const uri = process.env.MONGOURL;

let connectDB;

if (process.env.NODE_ENV === "development") {
  if (!global._mongo) {
    global._mongo = new MongoClient(uri).connect();
  }
  connectDB = global._mongo;
} else {
  connectDB = new MongoClient(uri).connect();
}

export default connectDB;
