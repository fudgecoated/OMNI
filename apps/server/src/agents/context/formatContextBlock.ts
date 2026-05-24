import type { OutreachContext } from "@hermes/shared";

export function formatOutreachContextBlock(ctx: OutreachContext): string {
  const parts: string[] = [];

  if (ctx.company) {
    const c = ctx.company;
    parts.push(
      `## Company research: ${c.company}`,
      c.summary,
      c.productsAndTeams.length
        ? `Teams/products: ${c.productsAndTeams.join("; ")}`
        : "",
      c.cultureValues.length ? `Culture: ${c.cultureValues.join(", ")}` : "",
      c.recentNews.length ? `Recent: ${c.recentNews.join(" | ")}` : "",
      c.techStack.length ? `Tech: ${c.techStack.join(", ")}` : "",
      c.hiringSignals.length ? `Hiring signals: ${c.hiringSignals.join("; ")}` : "",
      c.internRelevance ? `Why this company for interns: ${c.internRelevance}` : ""
    );
  }

  if (ctx.jobRole) {
    const j = ctx.jobRole;
    parts.push(
      `## Target role: ${j.roleTitle} (${j.level})`,
      j.summary,
      j.responsibilities.length
        ? `Typical responsibilities: ${j.responsibilities.join("; ")}`
        : "",
      j.skillsToEmphasize.length
        ? `Skills to emphasize: ${j.skillsToEmphasize.join(", ")}`
        : "",
      j.talkingPoints.length ? `Role talking points: ${j.talkingPoints.join("; ")}` : ""
    );
  }

  if (ctx.applicant) {
    const a = ctx.applicant;
    parts.push(a.narrativeForAI);
    if (a.outreachAngles.length) {
      parts.push(`Outreach angles: ${a.outreachAngles.join("; ")}`);
    }
  }

  return parts.filter(Boolean).join("\n");
}
