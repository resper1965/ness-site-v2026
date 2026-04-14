import express from "express";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const app = express();
    app.use(express.json());
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    // API Route for Insights (CMS Simulation)
    app.get("/api/insights", async (req, res) => {
      const lang = req.query.lang || "pt";
      try {
        const response = await fetch(`https://backoffice.ness.com.br/api/insights?lang=${lang}`);
        const data = await response.json();
        res.json(data);
      } catch (error) {
        console.error("Error fetching insights from backoffice:", error);
        res.status(500).json({ error: "Failed to fetch insights" });
      }
    });

    // API Route for Jobs
    app.get("/api/jobs", async (req, res) => {
      const lang = req.query.lang || "pt";
      try {
        const response = await fetch(`https://backoffice.ness.com.br/api/jobs?lang=${lang}`);
        const data = await response.json();
        res.json(data);
      } catch (error) {
        console.error("Error fetching jobs from backoffice:", error);
        res.status(500).json({ error: "Failed to fetch jobs" });
      }
    });

    // API Route for Success Cases
    app.get("/api/cases", async (req, res) => {
      const lang = req.query.lang || "pt";
      try {
        const response = await fetch(`https://backoffice.ness.com.br/api/cases?lang=${lang}`);
        const data = await response.json();
        res.json(data);
      } catch (error) {
        console.error("Error fetching cases from backoffice:", error);
        res.status(500).json({ error: "Failed to fetch cases" });
      }
    });

    // API Route for Form Submissions (Contact, Careers, Whistleblowing)
    app.post("/api/submit-form", async (req, res) => {
      try {
        const response = await fetch("https://backoffice.ness.com.br/api/forms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
      } catch (error) {
        console.error("Error submitting form to backoffice:", error);
        res.status(500).json({ error: "Failed to submit form" });
      }
    });

    // API Route for Chatbot (Gabi.OS)
    app.post("/api/chat", async (req, res) => {
      try {
        const response = await fetch("https://backoffice.ness.com.br/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
      } catch (error) {
        console.error("Error connecting to Gabi.OS backoffice:", error);
        res.status(500).json({ reply: "desculpe, tive um problema na conexão com o backoffice. tente novamente em instantes." });
      }
    });

    app.use(vite.middlewares);
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Dev server running on http://localhost:${PORT}`);
    });
  } else {
    const app = new Hono();
    
    app.get("/api/insights", async (c) => {
      const lang = c.req.query("lang") || "pt";
      try {
        const response = await fetch(`https://backoffice.ness.com.br/api/insights?lang=${lang}`);
        const data = await response.json();
        return c.json(data);
      } catch (error) {
        return c.json({ error: "Failed to fetch insights" }, 500);
      }
    });

    app.get("/api/jobs", async (c) => {
      const lang = c.req.query("lang") || "pt";
      try {
        const response = await fetch(`https://backoffice.ness.com.br/api/jobs?lang=${lang}`);
        const data = await response.json();
        return c.json(data);
      } catch (error) {
        return c.json({ error: "Failed to fetch jobs" }, 500);
      }
    });

    app.get("/api/cases", async (c) => {
      const lang = c.req.query("lang") || "pt";
      try {
        const response = await fetch(`https://backoffice.ness.com.br/api/cases?lang=${lang}`);
        const data = await response.json();
        return c.json(data);
      } catch (error) {
        return c.json({ error: "Failed to fetch cases" }, 500);
      }
    });

    app.post("/api/submit-form", async (c) => {
      try {
        const body = await c.req.json();
        const response = await fetch("https://backoffice.ness.com.br/api/forms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await response.json();
        return c.json(data);
      } catch (error) {
        return c.json({ error: "Failed to submit form" }, 500);
      }
    });

    app.post("/api/chat", async (c) => {
      try {
        const body = await c.req.json();
        const response = await fetch("https://backoffice.ness.com.br/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await response.json();
        return c.json(data);
      } catch (error) {
        return c.json({ reply: "desculpe, tive um problema na conexão com o backoffice. tente novamente em instantes." }, 500);
      }
    });

    app.use("/assets/*", serveStatic({ root: "./dist" }));
    app.get("*", async (c) => {
      return c.html(await (await import("fs/promises")).readFile(path.join(process.cwd(), "dist/index.html"), "utf-8"));
    });

    console.log(`Production server running on http://localhost:${PORT}`);
    serve({
      fetch: app.fetch,
      port: PORT,
    });
  }
}

startServer();
