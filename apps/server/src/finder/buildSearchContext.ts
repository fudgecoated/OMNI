/**
 * Builds OutreachContext before people search: company brief, job role, applicant profile.
 * Non-seed companies use stub research by default (HERMES_FINDER_FAST=0 for full web research).
 */
import type { FinderSearchRequest, OutreachContext } from "@hermes/shared";
import { normalizeStudentProfile } from "@hermes/shared";
import { resolveCompanySlug, displayCompanyName } from "./companyAliases";
import { buildApplicantContext } from "../agents/context/applicantContext";
import { buildJobRoleContext } from "../agents/context/jobRoleContext";
import {
  runCompanyResearch,
  seedCompanyResearch,
  stubCompanyResearch,
} from "../agents/context/companyResearch";

export type BuildSearchContextOptions = {
  /** Skip live web research; use stub (people finder still researches in one AI pass). */
  skipLiveCompanyResearch?: boolean;
  /** Use this company block instead of researching (e.g. cached finder sample). */
  company?: import("@hermes/shared").CompanyResearch;
};

/** Company research → job role + applicant context (runs before people finder). */
export async function buildSearchContext(
  req: FinderSearchRequest,
  opts?: BuildSearchContextOptions
): Promise<OutreachContext> {
  const displayName = displayCompanyName(req.company);
  const slug = resolveCompanySlug(req.company);
  const role = req.role?.trim() || "software engineering intern";
  const teamFocus = req.teamFocus?.trim();
  const roleContext = teamFocus ? `${role} (${teamFocus} team focus)` : role;

  const company =
    opts?.company ??
    (slug
      ? seedCompanyResearch(slug, displayName)
      : opts?.skipLiveCompanyResearch ||
          process.env.HERMES_FINDER_FAST === "1"
        ? stubCompanyResearch(displayName, roleContext, req.city)
        : await runCompanyResearch({
            company: displayName,
            role: roleContext,
            city: req.city,
          }));

  const jobRole = buildJobRoleContext({
    role: roleContext,
    company: displayName,
    city: req.city,
    companyResearch: company,
  });

  const applicant = buildApplicantContext(
    normalizeStudentProfile(req.student),
    displayName
  );

  return { company, jobRole, applicant };
}
