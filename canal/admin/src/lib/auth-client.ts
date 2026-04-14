import { createAuthClient } from "better-auth/react";

// Detecta automaticamente a URL base do host atual
// Em produção: https://canal.ness.workers.dev
// Em dev: http://localhost:5173 (proxy Vite encaminha /api/* para :8787)
const baseURL = `${window.location.origin}/api/auth`;

export const authClient = createAuthClient({ baseURL });

export const { signIn, signUp, signOut, useSession } = authClient;
