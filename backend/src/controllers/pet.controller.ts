import { Request, Response } from "express";
import prisma from "../db/prisma.js";

// GET /api/pets
export const getPets = async (req: Request, res: Response) => {
  try {
    const pets = await prisma.pet.findMany({
      include: {
        owner: true,
      },
    });

    res.status(200).json(pets);
  } catch (error) {
    console.error("Erreur getPets :", error);
    res.status(500).json({ error: "Impossible de récupérer les animaux." });
  }
};

// GET /api/pets/:id
export const getPetById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const pet = await prisma.pet.findUnique({
      where: { id },
      include: {
        owner: true,
        healthLogs: true,
        reminders: true,
      },
    });

    if (!pet) {
      return res.status(404).json({ error: "Animal introuvable." });
    }

    res.status(200).json(pet);
  } catch (error) {
    console.error("Erreur getPetById :", error);
    res.status(500).json({ error: "Impossible de récupérer l'animal." });
  }
};

// POST /api/pets
export const createPet = async (req: Request, res: Response) => {
  try {
    const {
      name,
      species,
      breed,
      birthDate,
      sex,
      color,
      notes,
      ownerId,
    } = req.body;

    if (!name || !species || !ownerId) {
      return res.status(400).json({
        error: "Les champs name, species et ownerId sont obligatoires.",
      });
    }

    const pet = await prisma.pet.create({
      data: {
        name,
        species,
        breed,
        birthDate: birthDate ? new Date(birthDate) : null,
        sex,
        color,
        notes,
        ownerId: Number(ownerId),
      },
    });

    res.status(201).json(pet);
  } catch (error) {
    console.error("Erreur createPet :", error);
    res.status(500).json({ error: "Impossible de créer l'animal." });
  }
};

// PUT /api/pets/:id
export const updatePet = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const {
      name,
      species,
      breed,
      birthDate,
      sex,
      color,
      notes,
      ownerId,
    } = req.body;

    const existingPet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!existingPet) {
      return res.status(404).json({ error: "Animal introuvable." });
    }

    const updatedPet = await prisma.pet.update({
      where: { id },
      data: {
        name,
        species,
        breed,
        birthDate: birthDate ? new Date(birthDate) : null,
        sex,
        color,
        notes,
        ownerId: ownerId ? Number(ownerId) : existingPet.ownerId,
      },
    });

    res.status(200).json(updatedPet);
  } catch (error) {
    console.error("Erreur updatePet :", error);
    res.status(500).json({ error: "Impossible de modifier l'animal." });
  }
};

// DELETE /api/pets/:id
export const deletePet = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existingPet = await prisma.pet.findUnique({
      where: { id },
    });

    if (!existingPet) {
      return res.status(404).json({ error: "Animal introuvable." });
    }

    await prisma.pet.delete({
      where: { id },
    });

    res.status(200).json({ message: "Animal supprimé avec succès." });
  } catch (error) {
    console.error("Erreur deletePet :", error);
    res.status(500).json({ error: "Impossible de supprimer l'animal." });
  }
};