import { MongoClient, type Db } from "mongodb";

/** Collections used by the CMS. */
export type ContentDoc = { _id: string; data: unknown; updatedAt: Date };
export type MediaDoc = {
  _id: string; // ImageKit fileId
  url: string;
  name: string;
  width: number;
  height: number;
  size: number;
  /** For photos moved from /public: the original local path. */
  sourcePath?: string;
  createdAt: Date;
};
export type EnquiryDoc = {
  page: string;
  name: string;
  company: string;
  contact: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
};

export const isDbConfigured = () => Boolean(process.env.MONGODB_URI);

const globalForMongo = globalThis as unknown as { _mongoClient?: Promise<MongoClient> };

function client(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set. Add it to .env.local.");
  // Reuse one connection across hot reloads and serverless invocations.
  if (!globalForMongo._mongoClient) {
    globalForMongo._mongoClient = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 })
      .connect()
      .catch((err) => {
        globalForMongo._mongoClient = undefined;
        throw err;
      });
  }
  return globalForMongo._mongoClient;
}

export async function db(): Promise<Db> {
  return (await client()).db(process.env.MONGODB_DB || "portfolio");
}

export async function collections() {
  const d = await db();
  return {
    content: d.collection<ContentDoc>("content"),
    media: d.collection<MediaDoc>("media"),
    enquiries: d.collection<EnquiryDoc>("enquiries"),
  };
}
