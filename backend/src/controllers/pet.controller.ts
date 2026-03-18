import { Request, Response } from "express";
import prisma from "../db/prisma.js";

export async function getPets(_req: Request, res: Response) {
  const pets = await prisma.pet.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(pets);
}

export async function getPetById(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid pet id" });
  }

  const pet = await prisma.pet.findUnique({
    where: { id },
  });

  if (!pet) {
    return res.status(404).json({ message: "Pet not found" });
  }

  res.json(pet);
}

export async function createPet(req: Request, res: Response) {
  const { name, species, breed, birthDate, sex, color, notes } = req.body;

  if (!name || !species) {
    return res.status(400).json({ message: "name and species are required" });
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
    },
  });

  res.status(201).json(pet);
}

export async function updatePet(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid pet id" });
  }

  const existingPet = await prisma.pet.findUnique({
    where: { id },
  });

  if (!existingPet) {
    return res.status(404).json({ message: "Pet not found" });
  }

  const { name, species, breed, birthDate, sex, color, notes } = req.body;

  const pet = await prisma.pet.update({
    where: { id },
    data: {
      name,
      species,
      breed,
      birthDate: birthDate ? new Date(birthDate) : null,
      sex,
      color,
      notes,
    },
  });

  res.json(pet);
}

export async function deletePet(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid pet id" });
  }

  const existingPet = await prisma.pet.findUnique({
    where: { id },
  });

  if (!existingPet) {
    return res.status(404).json({ message: "Pet not found" });
  }

  await prisma.pet.delete({
    where: { id },
  });

  res.status(204).send();
}