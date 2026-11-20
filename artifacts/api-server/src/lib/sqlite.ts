
import { DatabaseSync } from "node:sqlite";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

// The backend runs from artifacts/api-server.
// Go back two folders to reach the main Cinematch project.
const databasePath = resolve(
  process.cwd(),
  "../../data/cinematch.db",
);

// Make sure the database exists before connecting.
if (!existsSync(databasePath)) {
  throw new Error(
    `Cinematch database not found at: ${databasePath}`,
  );
}

// Open the SQLite database.
export const sqlite = new DatabaseSync(databasePath);

// Enable foreign key validation.
sqlite.exec("PRAGMA foreign_keys = ON;");

console.log("Cinematch SQLite database connected successfully!");
