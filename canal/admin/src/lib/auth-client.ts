import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import { agentAuthClient } from "@better-auth/agent-auth/client";

// Detecta automaticamente a URL base do host atual
// Em produção: https://canal.ness.workers.dev
// Em dev: http://localhost:5173 (proxy Vite encaminha /api/* para :8787)
const baseURL = `${window.location.origin}/api/auth`;

export const authClient = createAuthClient({ 
  baseURL,
  plugins: [
    adminClient(),
    organizationClient(),
    agentAuthClient()
  ]
});

export const { signIn, signUp, signOut, useSession, organization, admin, agent } = authClient;
