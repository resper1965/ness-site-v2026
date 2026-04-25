-- ============================================================
--  canal. — Schema v2  (ness. site 2026)
--  Migração completa: suporte a todos os campos do front
-- ============================================================

-- ── insights (blog) ─────────────────────────────────────────
DROP TABLE IF EXISTS insights;
CREATE TABLE insights (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  lang         TEXT    NOT NULL DEFAULT 'pt',
  slug         TEXT    NOT NULL,
  title        TEXT    NOT NULL,
  tag          TEXT    NOT NULL DEFAULT '',
  icon         TEXT    NOT NULL DEFAULT 'FileText',
  date         TEXT    NOT NULL,
  desc         TEXT    NOT NULL DEFAULT '',
  published    INTEGER NOT NULL DEFAULT 1,
  featured     INTEGER NOT NULL DEFAULT 0,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── jobs (careers) ──────────────────────────────────────────
DROP TABLE IF EXISTS jobs;
CREATE TABLE jobs (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  lang         TEXT    NOT NULL DEFAULT 'pt',
  title        TEXT    NOT NULL,
  vertical     TEXT    NOT NULL DEFAULT 'engenharia',
  location     TEXT    NOT NULL,
  type         TEXT    NOT NULL DEFAULT 'Full-time',
  desc         TEXT    NOT NULL DEFAULT '',
  requirements TEXT    NOT NULL DEFAULT '[]',  -- JSON array
  published    INTEGER NOT NULL DEFAULT 1,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── cases (portfolio) ───────────────────────────────────────
DROP TABLE IF EXISTS cases;
CREATE TABLE cases (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  lang         TEXT    NOT NULL DEFAULT 'pt',
  slug         TEXT    NOT NULL,
  client       TEXT    NOT NULL,
  category     TEXT    NOT NULL DEFAULT 'infraestrutura',
  project      TEXT    NOT NULL,
  result       TEXT    NOT NULL DEFAULT '',
  desc         TEXT    NOT NULL DEFAULT '',
  stats        TEXT    NOT NULL DEFAULT '',
  image        TEXT    NOT NULL DEFAULT '',
  featured     INTEGER NOT NULL DEFAULT 0,
  published    INTEGER NOT NULL DEFAULT 1,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── forms (contato/lead) ────────────────────────────────────
DROP TABLE IF EXISTS forms;
CREATE TABLE forms (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  payload      TEXT    NOT NULL,
  source       TEXT    NOT NULL,
  status       TEXT    NOT NULL DEFAULT 'new',
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── newsletter ──────────────────────────────────────────────
DROP TABLE IF EXISTS newsletter;
CREATE TABLE newsletter (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── chats (ai chatbot logs) ─────────────────────────────────
DROP TABLE IF EXISTS chats;
CREATE TABLE chats (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id   TEXT    NOT NULL UNIQUE,
  messages     TEXT    NOT NULL DEFAULT '[]', -- Armazena as interações como JSON {role, content}
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ── leads (CRM Triagem Bots) ────────────────────────────────
DROP TABLE IF EXISTS leads;
CREATE TABLE leads (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT    NOT NULL,
  contact      TEXT    NOT NULL,
  source       TEXT    NOT NULL DEFAULT 'chatbot',
  intent       TEXT    NOT NULL DEFAULT 'geral',
  urgency      TEXT    NOT NULL DEFAULT 'baixa',
  status       TEXT    NOT NULL DEFAULT 'new',
  tenant_id    TEXT,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);
