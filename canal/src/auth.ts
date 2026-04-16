/**
 * Canal CMS — Better Auth Configuration
 *
 * Plugins:
 *   - emailAndPassword: login/signup padrão
 *   - admin: gestão de usuários, roles, ban/unban
 *   - organization: multi-tenancy (org → members → teams)
 *   - apiKey: acesso via API key para integrações e MCP
 *
 * Referência: Better Auth docs (Installation, Admin, Organization, API Key, MCP)
 */

import { betterAuth } from "better-auth";
import { admin, organization } from "better-auth/plugins";
import { apiKey } from "@better-auth/api-key";
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

    // ── Email & Password ────────────────────────────────────────
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },

    // ── Social providers placeholder ────────────────────────────
    // socialProviders: {
    //   google: {
    //     clientId: process.env.GOOGLE_CLIENT_ID!,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    //   },
    // },

    // ── Trusted origins ─────────────────────────────────────────
    trustedOrigins: [
      "https://canal.ness.workers.dev",
      "http://localhost:8787",
      "http://localhost:5173",
    ],

    // ── Plugins ─────────────────────────────────────────────────
    plugins: [
      // Admin: user management, roles, ban/unban, impersonate
      admin({
        defaultRole: "user",
      }),

      // Organization: multi-tenancy, members, invitations, teams
      organization({
        allowUserToCreateOrganization: true,
        creatorRole: "owner",
        teams: {
          enabled: true,
          maximumTeams: 20,
        },
        // sendInvitationEmail será implementado quando tivermos o serviço de email
        // async sendInvitationEmail(data) {
        //   const inviteLink = `${baseURL}/accept-invitation/${data.id}`;
        //   // TODO: integrar com Resend ou SES
        // },
      }),

      // API Key: para integrações externas e futuros MCP clients
      apiKey({
        // Prefix para facilitar identificação
        // Permitir keys com rate limiting padrão
      }),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;
