import { Router, type IRouter } from "express";
import { AppError } from "../middleware/errorHandler";
import { findPeople, isValidCompany } from "../finder/mockPeople";

export const finderRouter: IRouter = Router();

finderRouter.get("/companies/:company/people", (req, res, next) => {
  try {
    const company = req.params.company.toLowerCase();
    if (!isValidCompany(company)) {
      throw new AppError(400, `Invalid company. Use: google, amazon, meta`);
    }

    const people = findPeople(company, {
      role: typeof req.query.role === "string" ? req.query.role : undefined,
      school: typeof req.query.school === "string" ? req.query.school : undefined,
    });

    res.json({ company, count: people.length, people });
  } catch (err) {
    next(err);
  }
});
