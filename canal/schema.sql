DROP TABLE IF EXISTS insights;
CREATE TABLE insights (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lang TEXT NOT NULL DEFAULT 'pt',
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  tag TEXT
);

DROP TABLE IF EXISTS jobs;
CREATE TABLE jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lang TEXT NOT NULL DEFAULT 'pt',
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL
);

DROP TABLE IF EXISTS cases;
CREATE TABLE cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lang TEXT NOT NULL DEFAULT 'pt',
  title TEXT NOT NULL,
  sector TEXT NOT NULL,
  metric TEXT NOT NULL
);

DROP TABLE IF EXISTS forms;
CREATE TABLE forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  payload TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert mock data
INSERT INTO insights (lang, title, date, tag) VALUES 
('pt', 'Desenvolvimento Seguro em Escala', '2026-04-14', 'segurança'),
('en', 'Secure Development at Scale', '2026-04-14', 'security'),
('pt', 'A Evolução do Cloud Native', '2026-04-12', 'cloud'),
('en', 'Cloud Native Evolution', '2026-04-12', 'cloud');

INSERT INTO jobs (lang, title, location, type) VALUES 
('pt', 'Frontend Eng. - Hono', 'Remote', 'Full-Time'),
('en', 'Frontend Engineer - Hono', 'Remote', 'Full-Time');

INSERT INTO cases (lang, title, sector, metric) VALUES 
('pt', 'Transformação Digital Bancária', 'Finance', '+40% efficiency'),
('en', 'Banking Digital Transformation', 'Finance', '+40% efficiency');
