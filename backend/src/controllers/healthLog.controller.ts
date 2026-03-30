import { Request, Response } from "express";
import prisma from "../db/prisma.js";

// GET /api/health-logs
export const getHealthLogs = async (req: Request, res: Response) => {
  try {
    const healthLogs = await prisma.healthLog.findMany({
      include: {
        pet: true,
      },
    });

    res.status(200).json(healthLogs);
  } catch (error) {
    console.error("Erreur getHealthLogs :", error);
    res.status(500).json({ error: "Impossible de récupérer les historiques de santé." });
  }
};

// GET /api/health-logs/:id
export const getHealthLogById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const healthLog = await prisma.healthLog.findUnique({
      where: { id },
      include: {
        pet: true,
      },
    });

    if (!healthLog) {
      return res.status(404).json({ error: "Historique de santé introuvable." });
    }

    res.status(200).json(healthLog);
  } catch (error) {
    console.error("Erreur getHealthLogById :", error);
    res.status(500).json({ error: "Impossible de récupérer l'historique de santé." });
  }
};

// GET /api/health-logs/pet/:petId
export const getHealthLogsByPetId = async (req: Request, res: Response) => {
  try {
    const petId = Number(req.params.petId);

    const healthLogs = await prisma.healthLog.findMany({
      where: { petId },
      orderBy: {
        logDate: "desc",
      },
    });

    res.status(200).json(healthLogs);
  } catch (error) {
    console.error("Erreur getHealthLogsByPetId :", error);
    res.status(500).json({ error: "Impossible de récupérer les historiques de cet animal." });
  }
};

// POST /api/health-logs
export const createHealthLog = async (req: Request, res: Response) => {
  try {
    const {
      petId,
      category,
      title,
      valueNumber,
      unit,
      description,
      logDate,
    } = req.body;

    if (!petId || !category || !title || !logDate) {
      return res.status(400).json({
        error: "Les champs petId, category, title et logDate sont obligatoires.",
      });
    }

    const healthLog = await prisma.healthLog.create({
      data: {
        petId: Number(petId),
        category,
        title,
        valueNumber: valueNumber !== undefined ? Number(valueNumber) : null,
        unit,
        description,
        logDate: new Date(logDate),
      },
    });

    res.status(201).json(healthLog);
  } catch (error) {
    console.error("Erreur createHealthLog :", error);
    res.status(500).json({ error: "Impossible de créer l'historique de santé." });
  }
};

// PUT /api/health-logs/:id
export const updateHealthLog = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const {
      category,
      title,
      valueNumber,
      unit,
      description,
      logDate,
    } = req.body;

    const existingHealthLog = await prisma.healthLog.findUnique({
      where: { id },
    });

    if (!existingHealthLog) {
      return res.status(404).json({ error: "Historique de santé introuvable." });
    }

    const updatedHealthLog = await prisma.healthLog.update({
      where: { id },
      data: {
        category,
        title,
        valueNumber: valueNumber !== undefined ? Number(valueNumber) : null,
        unit,
        description,
        logDate: logDate ? new Date(logDate) : existingHealthLog.logDate,
      },
    });

    res.status(200).json(updatedHealthLog);
  } catch (error) {
    console.error("Erreur updateHealthLog :", error);
    res.status(500).json({ error: "Impossible de modifier l'historique de santé." });
  }
};

// DELETE /api/health-logs/:id
export const deleteHealthLog = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existingHealthLog = await prisma.healthLog.findUnique({
      where: { id },
    });

    if (!existingHealthLog) {
      return res.status(404).json({ error: "Historique de santé introuvable." });
    }

    await prisma.healthLog.delete({
      where: { id },
    });

    res.status(200).json({ message: "Historique de santé supprimé avec succès." });
  } catch (error) {
    console.error("Erreur deleteHealthLog :", error);
    res.status(500).json({ error: "Impossible de supprimer l'historique de santé." });
  }
};