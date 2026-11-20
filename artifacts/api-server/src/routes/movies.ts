
import { Router, type IRouter } from "express";
import { sqlite } from "../lib/sqlite";

const router: IRouter = Router();

// GET /api/movies
router.get("/movies", (req, res) => {
  try {
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 20, 1),
      100,
    );

    const offset = Math.max(
      Number(req.query.offset) || 0,
      0,
    );

    const movies = sqlite
      .prepare(`
        SELECT
          movie_id AS movieId,
          title,
          genres
          FROM movies
            ORDER BY title
          LIMIT ? OFFSET ?
      `)
      .all(limit, offset);

    res.json({
      success: true,
      total: sqlite
        .prepare("SELECT COUNT(*) AS count FROM movies")
        .get(),
      movies,
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch movies",
    });
  }
});

export default router;
