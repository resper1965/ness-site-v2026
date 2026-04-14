import { betterAuth } from "better-auth";
import { kyselyAdapter } from "@better-auth/kysely-adapter";
import { Kysely } from "kysely";
import { D1Dialect } from "kysely-d1";

// Factory: cria instância por request para injetar o binding D1 do Cloudflare
export function createAuth(db: D1Database, secret: string, baseURL: string) {
  const kyselyDb = new Kysely({ dialect: new D1Dialect({ database: db }) });

  return betterAuth({
    database: kyselyAdapter(kyselyDb, { type: "sqlite" }),
    secret,
    baseURL,
    emailAndPassword: {
      enabled: true,
    },
    trustedOrigins: [
      "https://canal.ness.workers.dev",
      "http://localhost:8787",
      "http://localhost:5173",
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;
