import type {
  GenerateFollowupRequest,
  GenerateFollowupResponse,
  GenerateMessageRequest,
  GenerateMessageResponse,
} from "@hermes/shared";
import { normalizeStudentProfile } from "@hermes/shared";

function companyLabel(company: string): string {
  const labels: Record<string, string> = {
    google: "Google",
    amazon: "Amazon",
    meta: "Meta",
  };
  return labels[company] ?? company;
}

function firstName(full: string): string {
  return full.split(" ")[0] || full;
}

function pickProject(req: GenerateMessageRequest) {
  const fromCtx = req.outreachContext?.applicant?.projects?.find(
    (p) => p.name && p.description
  );
  if (fromCtx) return fromCtx;
  const s = normalizeStudentProfile(req.student);
  return s.projects.find((p) => p.name && p.description);
}

function projectProof(req: GenerateMessageRequest): string {
  const p = pickProject(req);
  if (!p) return "";
  const tech = p.tech.length ? ` using ${p.tech.slice(0, 3).join(", ")}` : "";
  const metric = p.highlight ? ` (${p.highlight})` : "";
  return `Recently I built ${p.name}${tech} — ${p.description}${metric}.`;
}

function companyHook(req: GenerateMessageRequest, company: string): string {
  const c = req.outreachContext?.company;
  const team = c?.productsAndTeams[0] ?? req.person.team;
  if (team && c?.recentNews[0]) {
    return `I've been following ${team} at ${company}, especially ${c.recentNews[0].toLowerCase()}.`;
  }
  if (team) return `I'm especially interested in ${team} at ${company}.`;
  if (c?.summary) return c.summary.slice(0, 140) + (c.summary.length > 140 ? "…" : "");
  return `Your work on ${req.person.team} at ${company} caught my attention.`;
}

function whyHook(req: GenerateMessageRequest): string {
  const why =
    req.outreachContext?.applicant?.jobSearchWhy?.trim() ||
    normalizeStudentProfile(req.student).jobSearchWhy;
  if (!why) return "";
  const sentence = why.endsWith(".") ? why : `${why}.`;
  return sentence.length > 200 ? sentence.slice(0, 197) + "…" : sentence;
}

function learningLine(req: GenerateMessageRequest): string {
  const learning = req.outreachContext?.applicant?.skillsLearning;
  const items = learning?.length
    ? learning
    : normalizeStudentProfile(req.student).skillsLearning;
  if (!items.length) return "";
  return `I'm currently deepening my skills in ${items.slice(0, 2).join(" and ")}.`;
}

/** Personalized drafts using full applicant + company + role context. */
export function generateMessage(
  req: GenerateMessageRequest
): GenerateMessageResponse {
  const { person, student, templateType } = req;
  const profile = normalizeStudentProfile(student);
  const company = companyLabel(person.company);
  const name = firstName(person.name);
  const schoolLine = person.schoolConnection
    ? `I noticed we're both connected to ${person.schoolConnection} — that path really resonates with me.`
    : "";

  const proof = projectProof(req);
  const why = whyHook(req);
  const companyLine = companyHook(req, company);
  const learning = learningLine(req);

  if (templateType === "connection_request") {
    const bits = [
      `Hi ${name},`,
      `I'm ${profile.name}, a ${profile.year} ${profile.school} student targeting ${profile.targetRole}.`,
      proof,
      schoolLine,
      "Would love to connect!",
    ].filter(Boolean);
    return { templateType, subject: "", body: bits.join(" ") };
  }

  const innovative = req.outreachContext?.applicant?.innovativeWork?.trim();
  const innovLine =
    innovative && !proof.includes(innovative)
      ? `On the side I'm ${innovative.charAt(0).toLowerCase()}${innovative.slice(1)}${innovative.endsWith(".") ? "" : "."}`
      : "";

  const stackLine =
    req.outreachContext?.company?.techStack.length && profile.skillsCanDo.length
      ? `My experience with ${profile.skillsCanDo.slice(0, 2).join(" and ")} lines up with stacks like ${req.outreachContext.company.techStack.slice(0, 2).join(" and ")}.`
      : profile.githubUrl
        ? `More on my work: ${profile.githubUrl}`
        : "";

  const body = [
    `Hi ${name},`,
    "",
    `I'm ${profile.name}, a ${profile.year} student at ${profile.school} in ${profile.location}.`,
    "",
    why,
    "",
    companyLine,
    "",
    proof,
    innovLine,
    learning,
    stackLine,
    "",
    schoolLine,
    "",
    `Would you have 15 minutes for a quick chat about your journey to ${company}? I'd really value your perspective.`,
    "",
    "Thanks,",
    profile.name,
  ]
    .filter((line) => line !== "")
    .join("\n");

  return {
    templateType,
    subject: `${profile.school} · ${profile.targetRole} → ${person.team} @ ${company}`,
    body,
  };
}

export function generateFollowup(
  req: GenerateFollowupRequest
): GenerateFollowupResponse {
  const first = firstName(req.person.name);
  const company = companyLabel(req.person.company);
  const profile = normalizeStudentProfile(req.student);
  const team =
    req.outreachContext?.company?.productsAndTeams[0] ?? req.person.team;
  const project =
    req.outreachContext?.applicant?.projects?.find((p) => p.name && p.description) ??
    normalizeStudentProfile(req.student).projects.find((p) => p.name && p.description);

  const proof = project
    ? ` I'm still excited about ${project.name} and how it relates to work on ${team}.`
    : "";

  return {
    subject: `Re: Quick follow-up — ${profile.school}`,
    body: `Hi ${first},

Just bumping my note from ${req.daysSinceContact} days ago — totally understand if you're busy.${proof}

I'd still appreciate 15 minutes to hear about your path to ${team} at ${company}.

Thanks again,
${profile.name}`,
  };
}
