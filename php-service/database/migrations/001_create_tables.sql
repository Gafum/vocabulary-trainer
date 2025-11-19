-- Create users and words tables
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS words (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    word TEXT NOT NULL,
    meaning TEXT NOT NULL,
    learned INTEGER DEFAULT 0,
    progress INTEGER DEFAULT 0,
    FOREIGN KEY(userId) REFERENCES users(id)
);
