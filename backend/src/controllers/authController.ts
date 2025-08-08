import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { Request, Response } from "express";
import { LoginRequest, RegisterRequest, AuthResponse } from "../types";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password }: RegisterRequest = req.body;

    // check if the email or username is in use
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exist" });
    }

    // hash
    const hashedPassword = bcrypt.hashSync(password, 10);

    // put
    const user = await prisma.user.create({
      data: { email, password, username },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    const response: AuthResponse = { user, token };

    res.json(response);
  } catch (error) {
    console.log("Registration error: ", error);
    res.status(500).json({ error: "Registation failed" });
  }
};
