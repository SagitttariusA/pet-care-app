import { Request, Response } from "express";
import prisma from "../db/prisma.js";

// GET /api/reminders
export const getReminders = async (req: Request, res: Response) => {
  try {
    const reminders = await prisma.reminder.findMany({
      include: {
        pet: true,
      },
    });

    res.status(200).json(reminders);
  } catch (error) {
    console.error("Erreur getReminders :", error);
    res.status(500).json({ error: "Impossible de récupérer les rappels." });
  }
};

// GET /api/reminders/:id
export const getReminderById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const reminder = await prisma.reminder.findUnique({
      where: { id },
      include: {
        pet: true,
      },
    });

    if (!reminder) {
      return res.status(404).json({ error: "Rappel introuvable." });
    }

    res.status(200).json(reminder);
  } catch (error) {
    console.error("Erreur getReminderById :", error);
    res.status(500).json({ error: "Impossible de récupérer le rappel." });
  }
};

// GET /api/reminders/pet/:petId
export const getRemindersByPetId = async (req: Request, res: Response) => {
  try {
    const petId = Number(req.params.petId);

    const reminders = await prisma.reminder.findMany({
      where: { petId },
      orderBy: {
        dueDate: "asc",
      },
    });

    res.status(200).json(reminders);
  } catch (error) {
    console.error("Erreur getRemindersByPetId :", error);
    res.status(500).json({ error: "Impossible de récupérer les rappels de cet animal." });
  }
};

// POST /api/reminders
export const createReminder = async (req: Request, res: Response) => {
  try {
    const { petId, title, description, dueDate, status } = req.body;

    if (!petId || !title || !dueDate || !status) {
      return res.status(400).json({
        error: "Les champs petId, title, dueDate et status sont obligatoires.",
      });
    }

    const reminder = await prisma.reminder.create({
      data: {
        petId: Number(petId),
        title,
        description,
        dueDate: new Date(dueDate),
        status,
      },
    });

    res.status(201).json(reminder);
  } catch (error) {
    console.error("Erreur createReminder :", error);
    res.status(500).json({ error: "Impossible de créer le rappel." });
  }
};

// PUT /api/reminders/:id
export const updateReminder = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const { title, description, dueDate, status } = req.body;

    const existingReminder = await prisma.reminder.findUnique({
      where: { id },
    });

    if (!existingReminder) {
      return res.status(404).json({ error: "Rappel introuvable." });
    }

    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : existingReminder.dueDate,
        status,
      },
    });

    res.status(200).json(updatedReminder);
  } catch (error) {
    console.error("Erreur updateReminder :", error);
    res.status(500).json({ error: "Impossible de modifier le rappel." });
  }
};

// DELETE /api/reminders/:id
export const deleteReminder = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const existingReminder = await prisma.reminder.findUnique({
      where: { id },
    });

    if (!existingReminder) {
      return res.status(404).json({ error: "Rappel introuvable." });
    }

    await prisma.reminder.delete({
      where: { id },
    });

    res.status(200).json({ message: "Rappel supprimé avec succès." });
  } catch (error) {
    console.error("Erreur deleteReminder :", error);
    res.status(500).json({ error: "Impossible de supprimer le rappel." });
  }
};