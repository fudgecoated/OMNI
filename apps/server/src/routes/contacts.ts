import { Router, type IRouter } from "express";
import { AppError } from "../middleware/errorHandler";
import {
  createContact,
  deleteContact,
  getContact,
  listContacts,
  listDueContacts,
  updateContact,
} from "../tracker/storage";
import type { CreateContactRequest, UpdateContactRequest } from "@hermes/shared";

export const contactsRouter: IRouter = Router();

contactsRouter.get("/", (_req, res) => {
  res.json({ contacts: listContacts() });
});

contactsRouter.get("/due", (req, res) => {
  const withinDays = req.query.withinDays
    ? Number(req.query.withinDays)
    : 0;
  res.json({ contacts: listDueContacts(withinDays) });
});

contactsRouter.get("/:id", (req, res, next) => {
  try {
    const contact = getContact(req.params.id);
    if (!contact) throw new AppError(404, "Contact not found");
    res.json(contact);
  } catch (err) {
    next(err);
  }
});

contactsRouter.post("/", (req, res, next) => {
  try {
    const body = req.body as CreateContactRequest;
    if (!body?.company || !body?.personName || !body?.linkedinUrl) {
      throw new AppError(400, "company, personName, and linkedinUrl are required");
    }
    res.status(201).json(createContact(body));
  } catch (err) {
    next(err);
  }
});

contactsRouter.patch("/:id", (req, res, next) => {
  try {
    const patch = req.body as UpdateContactRequest;
    const updated = updateContact(req.params.id, patch);
    if (!updated) throw new AppError(404, "Contact not found");
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

contactsRouter.delete("/:id", (req, res, next) => {
  try {
    const removed = deleteContact(req.params.id);
    if (!removed) throw new AppError(404, "Contact not found");
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
