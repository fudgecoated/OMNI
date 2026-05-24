import type { OutreachContext, OutreachGuidance } from "@hermes/shared";

function unique(items: string[]): string[] {
  return Array.from(new Set(items.map((s) => s.trim()).filter(Boolean)));
}

function shortLabel(text: string, max = 72): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function firstTeamLabel(team: string): string {
  return team.split(/[·(,|]/)[0]?.trim() ?? team;
}

/** Personalized apply + learn + outreach recommendations from pin context. */
export function buildOutreachGuidance(ctx: OutreachContext): OutreachGuidance {
  const { company, jobRole, applicant } = ctx;
  const applyApproach: string[] = [];
  const skillsToLearn: string[] = [];
  const outreachStrategy: string[] = [];
  const messageAngles = applicant?.outreachAngles?.slice(0, 4) ?? [];

  if (!company) {
    return { applyApproach, skillsToLearn, outreachStrategy, messageAngles };
  }

  const roleTitle =
    jobRole?.roleTitle ?? applicant?.targetRole ?? "software engineering intern";
  const level = jobRole?.level ?? "intern";
  const isIntern =
    level === "intern" || /intern|co-?op/i.test(roleTitle);
  const isProduct =
    /product owner|product manager|product\b/i.test(roleTitle) &&
    !/software engineer/i.test(roleTitle);
  const city = applicant?.location?.split(",")[0]?.trim();

  if (isIntern) {
    applyApproach.push(
      `Check ${company.company} careers for intern or new grad roles; save the requisition ID when you apply.`
    );
    applyApproach.push(
      "If there is no intern posting, apply to adjacent term or junior roles only when the JD explicitly welcomes students."
    );
  } else if (isProduct) {
    applyApproach.push(
      `Apply to live ${company.company} Product Owner postings; lead your resume with backlog ownership, APIs, and stakeholder communication.`
    );
  } else {
    applyApproach.push(
      `Search ${company.company} careers for "${roleTitle}"${city ? ` in ${city}` : ""} and tailor your resume to the posted stack.`
    );
  }

  if (company.hiringSignals[0]) {
    applyApproach.push(
      `Mention a current hiring signal in outreach: ${shortLabel(company.hiringSignals[0])}`
    );
  }

  if (company.internRelevance) {
    applyApproach.push(shortLabel(company.internRelevance, 200));
  }

  if (applicant?.skillsAvoid?.length) {
    applyApproach.push(`Do not claim: ${applicant.skillsAvoid.join("; ")}.`);
  }

  if (applicant?.skillsLearning?.length) {
    for (const skill of applicant.skillsLearning.slice(0, 3)) {
      skillsToLearn.push(`From your profile: deepen ${skill} with one small project or course module.`);
    }
  }

  if (company.techStack.length) {
    const stack = company.techStack
      .slice(0, 3)
      .map((item) => firstTeamLabel(item))
      .join(", ");
    skillsToLearn.push(
      `Read a recent ${company.company} job description and note how they use ${stack}.`
    );
  }

  if (isProduct) {
    const needsAgile =
      company.hiringSignals.some((s) => /scrum|agile/i.test(s)) &&
      !applicant?.skillsCanDo.some((s) => /scrum|agile/i.test(s));
    if (needsAgile) {
      skillsToLearn.push(
        "PO postings list Scrum/Agile as an asset: practice writing user stories and acceptance criteria."
      );
    }
    skillsToLearn.push(
      "Practice explaining one technical tradeoff you made on a project (API design, data model, or reliability)."
    );
  } else if (isIntern) {
    skillsToLearn.push(
      "Prepare one 60 second story: problem, what you built, metric, and what you would do differently."
    );
  }

  if (jobRole?.skillsToEmphasize.length) {
    skillsToLearn.push(
      `Emphasize in applications: ${jobRole.skillsToEmphasize.slice(0, 4).join(", ")}.`
    );
  }

  outreachStrategy.push(
    "Pick 3 to 5 contacts: a hiring influencer, an adjacent IC/PM, and a connector (recruiting or alumni)."
  );

  if (company.productsAndTeams[0]) {
    outreachStrategy.push(
      `Open with curiosity about ${firstTeamLabel(company.productsAndTeams[0])}, not generic praise of ${company.company}.`
    );
  }

  outreachStrategy.push(
    "First message: one proof project, one company specific hook, and a 15 minute chat ask. No referral request yet."
  );

  if (applicant?.githubUrl) {
    outreachStrategy.push(`Link your portfolio only if it supports the hook: ${applicant.githubUrl}`);
  }

  if (jobRole?.talkingPoints[0]) {
    outreachStrategy.push(shortLabel(`Talking point: ${jobRole.talkingPoints[0]}`, 160));
  }

  return {
    applyApproach: unique(applyApproach).slice(0, 5),
    skillsToLearn: unique(skillsToLearn).slice(0, 5),
    outreachStrategy: unique(outreachStrategy).slice(0, 5),
    messageAngles,
  };
}
