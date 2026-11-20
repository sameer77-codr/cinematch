
import { DatabaseSync } from "node:sqlite";
import { readFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Find the main Cinematch project directory.
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, "..");
const dataDirectory = resolve(projectDirectory, "data");

const moviesFile = resolve(dataDirectory, "movies.csv");
const ratingsFile = resolve(dataDirectory, "ratings.csv");
const databaseFile = resolve(dataDirectory, "cinematch.db");

// Parse one CSV row, including quoted fields containing commas.
function parseCsvLine(line) {
  const fields = [];
  let field = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      fields.push(field);
      field = "";
    } else {
      field += char;
    }
  }

  fields.push(field);
  return fields;
}

// Read and parse a MovieLens CSV file.
function readCsv(filePath) {
  const content = readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = content.trimEnd().split(/\r?\n/);

  return lines.map(parseCsvLine);
}

mkdirSync(dataDirectory, { recursive: true });

const moviesRows = readCsv(moviesFile);
const ratingsRows = readCsv(ratingsFile);

const movieHeaders = moviesRows[0];
const ratingHeaders = ratingsRows[0];

const movieIdIndex = movieHeaders.indexOf("movieId");
const titleIndex = movieHeaders.indexOf("title");
const genresIndex = movieHeaders.indexOf("genres");

const userIdIndex = ratingHeaders.indexOf("userId");
const ratingMovieIdIndex = ratingHeaders.indexOf("movieId");
const ratingIndex = ratingHeaders.indexOf("rating");
const timestampIndex = ratingHeaders.indexOf("timestamp");

if ([movieIdIndex, titleIndex, genresIndex].includes(-1)) {
  throw new Error("Invalid movies.csv format or missing columns.");
}

if (
  [userIdIndex, ratingMovieIdIndex, ratingIndex, timestampIndex].includes(-1)
) {
  throw new Error("Invalid ratings.csv format or missing columns.");
}

const db = new DatabaseSync(databaseFile);

try {
  db.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS movies (
      movie_id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      genres TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ratings (
      user_id INTEGER NOT NULL,
      movie_id INTEGER NOT NULL,
      rating REAL NOT NULL CHECK (rating >= 0.5 AND rating <= 5.0),
      timestamp INTEGER NOT NULL,
      PRIMARY KEY (user_id, movie_id),
      FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
    );

    CREATE INDEX IF NOT EXISTS idx_ratings_movie
    ON ratings(movie_id);

    CREATE INDEX IF NOT EXISTS idx_ratings_user
    ON ratings(user_id);
  `);

  const insertMovie = db.prepare(`
    INSERT INTO movies (movie_id, title, genres)
    VALUES (?, ?, ?)
  `);

  const insertRating = db.prepare(`
    INSERT INTO ratings (user_id, movie_id, rating, timestamp)
    VALUES (?, ?, ?, ?)
  `);

  // Import both CSV files in one transaction.
  db.exec("BEGIN TRANSACTION");

  try {
    // Clear previous imported data so rerunning is safe.
    db.exec("DELETE FROM ratings");
    db.exec("DELETE FROM movies");

    for (const row of moviesRows.slice(1)) {
      const movieId = Number(row[movieIdIndex]);
      const title = row[titleIndex];
      const genres = row[genresIndex];

      if (!Number.isInteger(movieId) || !title) continue;

      insertMovie.run(movieId, title, genres ?? "");
    }

    for (const row of ratingsRows.slice(1)) {
      const userId = Number(row[userIdIndex]);
      const movieId = Number(row[ratingMovieIdIndex]);
      const rating = Number(row[ratingIndex]);
      const timestamp = Number(row[timestampIndex]);

      if (
        !Number.isInteger(userId) ||
        !Number.isInteger(movieId) ||
        !Number.isFinite(rating) ||
        !Number.isInteger(timestamp)
      ) {
        continue;
      }

      insertRating.run(userId, movieId, rating, timestamp);
    }

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  const movieCount = db
    .prepare("SELECT COUNT(*) AS total FROM movies")
    .get().total;

  const ratingCount = db
    .prepare("SELECT COUNT(*) AS total FROM ratings")
    .get().total;

  console.log("\nMovieLens import completed successfully!");
  console.log("---------------------------------------");
  console.log(`Movies imported:  ${movieCount}`);
  console.log(`Ratings imported: ${ratingCount}`);
  console.log(`Database saved:   ${databaseFile}`);
} finally {
  db.close();
}
