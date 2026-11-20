
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("data/cinematch.db");

const addProfile = db.prepare(`
  INSERT INTO profiles (display_name, avatar_color)
  SELECT ?, ?
  WHERE NOT EXISTS (
    SELECT 1 FROM profiles WHERE display_name = ?
  )
`);

addProfile.run("Sameer Kumar", "#2563eb", "Sameer Kumar");
addProfile.run("Ram Swarup Dutta", "#9333ea", "Ram Swarup Dutta");
addProfile.run("Faadhil Mohammed", "#059669", "Faadhil Mohammed");

// Remove the old demo profile if it exists.
db.prepare("DELETE FROM profiles WHERE display_name = ?").run("Alex Morgan");

console.log("CineMatch profiles updated successfully!");
console.log(
  db.prepare("SELECT id, display_name, avatar_color FROM profiles ORDER BY id").all()
);

db.close();
