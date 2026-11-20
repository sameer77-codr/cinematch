
import { Router, type IRouter } from "express";
import { sqlite } from "../lib/sqlite";

const router: IRouter = Router();

// GET /api/profiles
router.get("/profiles", (_req, res) => {
  try {
    const profiles = sqlite
      .prepare(`
        SELECT
          id,
          display_name AS displayName,
          avatar_color AS avatarColor
        FROM profiles
        ORDER BY id
      `)
      .all();

    res.json({
      success: true,
      profiles,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch profiles",
    });
  }
});

export default router;
