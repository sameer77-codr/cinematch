
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("data/cinematch.db");

db.exec("PRAGMA foreign_keys = ON;");

db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    display_name TEXT NOT NULL,
    avatar_color TEXT NOT NULL DEFAULT '#6366f1',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profile_watchlist (
    profile_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    added_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (profile_id, movie_id),
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS profile_ratings (
    profile_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    rating REAL NOT NULL CHECK (rating >= 0.5 AND rating <= 5.0),
    rated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (profile_id, movie_id),
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS profile_genres (
    profile_id INTEGER NOT NULL,
    genre TEXT NOT NULL,
    PRIMARY KEY (profile_id, genre),
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
  );
`);

console.log("Profile database tables created successfully!");

db.close();
