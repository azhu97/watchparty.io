import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getAllGames = async (req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany({
      orderBy: { gameDate: "asc" },
    });
    res.json(games);
  } catch (error) {
    console.log("Error getting all games");
    res.status(500).json({ error: "Failed to fetch all games" });
  }
};

export const getGameById = async (req: Request, res: Response) => {
  try {
    const gameId = parseInt(req.params.id);
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        chatMessages: {
          include: { user: { select: { username: true } } },
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json(game);
  } catch (error) {
    console.log("Error getting game by id");
    res.status(500).json({ error: "Failed to fetch game by id" });
  }
};
