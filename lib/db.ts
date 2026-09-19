import { MongoClient, type Db } from "mongodb";

/**
 * Cached Mongo connection, reused across hot reloads in dev and across
 * invocations in serverless. Every caller treats "no db" the same way —
 * a safe empty result, never a thrown error — but callers that report the
 * reason to a person (the /admin dashboard) use getDbWithStatus() so they
 * can tell "you haven't set MONGODB_URI yet" apart from "MONGODB_URI is
 * set but the connection is failing" (wrong credentials, an unreachable
 * cluster, or — most commonly — the connecting IP isn't in Atlas's
 * Network Access list).
 */
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export type DbStatus = "ok" | "not_configured" | "connection_failed";

function getMongoClientPromise(): Promise<MongoClient> | null {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  if (!global._mongoClientPromise) {
    // Fail fast rather than hanging every request for Mongo's ~30s default
    // when the cluster is unreachable (wrong credentials, IP not
    // allow-listed, network down).
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

export async function getDbWithStatus(): Promise<{ db: Db | null; status: DbStatus }> {
  const clientPromise = getMongoClientPromise();
  if (!clientPromise) return { db: null, status: "not_configured" };

  try {
    const client = await clientPromise;
    return { db: client.db(process.env.MONGODB_DB || "blog"), status: "ok" };
  } catch (error) {
    console.warn(
      "[mongo] failed to connect — if MONGODB_URI looks correct, check Atlas → Network Access for an IP allow-list block:",
      error,
    );
    return { db: null, status: "connection_failed" };
  }
}

export async function getDb(): Promise<Db | null> {
  const { db } = await getDbWithStatus();
  return db;
}
