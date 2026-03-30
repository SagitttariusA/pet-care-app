import { Request, Response } from "express";
import prisma from "../db/prisma.js";

// GET /api/users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        pets: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur getUsers :", error);
    res.status(500).json({ error: "Impossible de récupérer les utilisateurs." });
  }
};

// GET /api/users/:id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        pets: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Erreur getUserById :", error);
    res.status(500).json({ error: "Impossible de récupérer l'utilisateur." });
  }
};

// POST /api/users
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, passwordHash } = req.body;

    if (!email || !passwordHash) {
      return res.status(400).json({
        error: "Les champs email et passwordHash sont obligatoires.",
      });
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Erreur createUser :", error);
    res.status(500).json({ error: "Impossible de créer l'utilisateur." });
  }
};