import { MongoClient } from "mongodb";
const uri = process.env.MONGOURL;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tlsAllowInvalidCertificates: true,
};
let connectDB;

if (process.env.NODE_ENV === "development") {
  if (!global._mongo) {
    global._mongo = new MongoClient(uri, options).connect();
  }
  connectDB = global._mongo;
} else {
  connectDB = new MongoClient(uri, options).connect();
}

export default connectDB;
