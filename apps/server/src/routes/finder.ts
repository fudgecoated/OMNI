/**
 * People Finder API — returns contacts + OutreachContext for a company search.
 *
 * Resolution order: WestJet cache → seed companies (google/amazon/meta) → Claude AI finder.
 * @see docs/FINDER.md
 */
import { Router, type IRouter } from "express";
import type { FinderSearchRequest, FinderSearchResponse } from "@hermes/shared";
import { normalizeStudentProfile } from "@hermes/shared";
import { AppError } from "../middleware/errorHandler";
import { buildApplicantContext } from "../agents/context/applicantContext";
import { buildJobRoleContext } from "../agents/context/jobRoleContext";
import { resolveCompanySlug, displayCompanyName } from "../finder/companyAliases";
import { aiFinderSearch } from "../finder/aiFinderSearch";
import { buildSearchContext } from "../finder/buildSearchContext";
import { tryCachedFinderSearch } from "../finder/cachedFinderSearch";
import { findPeople, isValidCompany } from "../finder/mockPeople";
import { dedupeTargets, personToTarget } from "../finder/outreachTargets";

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

finderRouter.post("/finder/search", (req, res, next) => {
  void (async () => {
    try {
      const body = req.body as FinderSearchRequest;
      if (!body?.company?.trim()) {
        throw new AppError(400, "company is required");
      }

      const displayName = displayCompanyName(body.company);
      const slug = resolveCompanySlug(body.company);

      const cached = tryCachedFinderSearch(body);
      if (cached?.context?.company) {
        const role = body.role?.trim() || "software engineering intern";
        const applicant = buildApplicantContext(
          normalizeStudentProfile(body.student),
          displayName
        );
        const jobRole = buildJobRoleContext({
          role,
          company: displayName,
          city: body.city,
          companyResearch: cached.context.company,
        });
        const response: FinderSearchResponse = {
          company: displayName,
          count: cached.people.length,
          people: dedupeTargets(cached.people),
          source: cached.source ?? "hermes_seed_data",
          context: { company: cached.context.company, jobRole, applicant },
        };
        res.json(response);
        return;
      }

      const skipLiveCompanyResearch =
        !slug && process.env.HERMES_FINDER_FAST !== "0";

      const context = await buildSearchContext(body, { skipLiveCompanyResearch });

      if (slug) {
        const people = findPeople(slug, {
          role: body.role,
          school: body.school,
        }).map(personToTarget);
        const response: FinderSearchResponse = {
          company: displayName,
          count: people.length,
          people,
          source: "hermes_seed_data",
          context,
        };
        res.json(response);
        return;
      }

      const people = await aiFinderSearch(body, context);
      const response: FinderSearchResponse = {
        company: displayName,
        count: people.length,
        people: dedupeTargets(people),
        source: "claude_ai",
        context,
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  })();
});
