import type {
  GenerateFollowupRequest,
  GenerateFollowupResponse,
  GenerateMessageRequest,
  GenerateMessageResponse,
} from "@hermes/shared";
import { normalizeStudentProfile, sanitizeOutreachCopy } from "@hermes/shared";

/** Email subjects should stay scannable in inbox previews. */
const SUBJECT_MAX = 58;
const BODY_WORD_MAX = 150;
const NEWS_HOOK_MAX = 72;

/**
 * Deterministic draft path used by the Message panel.
 *
 * The streaming coach can reason conversationally, but this writer guarantees a
 * fast draft that follows the outreach structure: why them, student proof,
 * company relevance, and a small ask.
 */
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

function clampText(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base =
    lastSpace > max * 0.55 ? cut.slice(0, lastSpace) : cut.slice(0, max - 1);
  return `${base.trim()}…`;
}

function shortSchool(school: string): string {
  const s = school.trim();
  if (/university of calgary/i.test(s)) return "UCalgary";
  const uof = s.match(/University of\s+(\w+)/i);
  if (uof) return `U${uof[1]}`;
  return s.split(/\s+/).slice(0, 2).join(" ");
}

function shortRole(role: string): string {
  const r = role.trim();
  if (r.length <= 28) return r;
  if (/software engineering intern/i.test(r)) return "SWE intern";
  if (/intern/i.test(r)) {
    return r
      .replace(/software engineering/gi, "SWE")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 28);
  }
  return clampText(r, 28);
}

function shortTeam(team: string): string {
  const first = team.split(/[·(,|]/)[0]?.trim() ?? team;
  if (first.length <= 24) return first;
  return clampText(first, 24);
}

function buildSubject(
  profile: ReturnType<typeof normalizeStudentProfile>,
  person: GenerateMessageRequest["person"],
  company: string
): string {
  const school = shortSchool(profile.school);
  const role = shortRole(profile.targetRole);
  const candidates = [
    `${school} ${role}, quick intro`,
    `Quick intro, ${role} @ ${company}`,
    `${school} student · ${company}`,
    `Intro: ${role} (${company})`,
    `${school} ${role} · ${shortTeam(person.team)}`,
  ];
  for (const c of candidates) {
    if (c.length <= SUBJECT_MAX) return c;
  }
  return clampText(candidates[0], SUBJECT_MAX);
}

function joinParagraphs(parts: (string | false | undefined | null)[]): string {
  return parts
    .map((p) => (p ? String(p).trim() : ""))
    .filter(Boolean)
    .join("\n\n");
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function trimToWordLimit(text: string, maxWords: number): string {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}…`;
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
  const line = `Recently I built ${p.name}${tech}: ${p.description}${metric}.`;
  return clampText(line, 220);
}

function companyHook(req: GenerateMessageRequest, company: string): string {
  const c = req.outreachContext?.company;
  const teamRaw = c?.productsAndTeams[0] ?? req.person.team;
  const team = shortTeam(teamRaw);
  if (team && c?.recentNews[0]) {
    const news = clampText(c.recentNews[0].toLowerCase(), NEWS_HOOK_MAX);
    return `I've been following ${team} at ${company}, especially ${news}.`;
  }
  if (team) return `I'm especially interested in ${team} at ${company}.`;
  if (c?.summary) {
    const summary = c.summary.replace(/\s+/g, " ").trim();
    return clampText(summary, 120);
  }
  return `Your work on ${shortTeam(req.person.team)} at ${company} caught my attention.`;
}

function whyHook(req: GenerateMessageRequest): string {
  const why =
    req.outreachContext?.applicant?.jobSearchWhy?.trim() ||
    normalizeStudentProfile(req.student).jobSearchWhy;
  if (!why) return "";
  const sentence = why.endsWith(".") ? why : `${why}.`;
  return sentence.length > 160 ? clampText(sentence, 160) : sentence;
}

function learningLine(req: GenerateMessageRequest): string {
  const learning = req.outreachContext?.applicant?.skillsLearning;
  const items = learning?.length
    ? learning
    : normalizeStudentProfile(req.student).skillsLearning;
  if (!items.length) return "";
  return `I'm currently deepening my skills in ${items.slice(0, 2).join(" and ")}.`;
}

function stackLine(req: GenerateMessageRequest, profile: ReturnType<typeof normalizeStudentProfile>): string {
  const stack = req.outreachContext?.company?.techStack;
  if (!stack?.length || !profile.skillsCanDo.length) return "";
  const skills = profile.skillsCanDo.slice(0, 2).join(" and ");
  const tools = stack
    .slice(0, 2)
    .map((s) => s.split(/\s+/).slice(0, 3).join(" "))
    .join(" and ");
  const line = `My experience with ${skills} lines up with stacks like ${tools}.`;
  return line.length > 140 ? clampText(line, 140) : line;
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
    ? `I noticed we're both connected to ${person.schoolConnection}, and that path really resonates with me.`
    : "";

  const proof = projectProof(req);
  const why = whyHook(req);
  const companyLine = companyHook(req, company);
  const learning = learningLine(req);

  if (templateType === "connection_request") {
    const bits = [
      `Hi ${name},`,
      `I'm ${profile.name}, a ${profile.year} ${shortSchool(profile.school)} student targeting ${shortRole(profile.targetRole)}.`,
      proof,
      schoolLine,
      "Would love to connect!",
    ].filter(Boolean);
    return {
      templateType,
      subject: "",
      body: sanitizeOutreachCopy(bits.join(" ")),
    };
  }

  const innovative = req.outreachContext?.applicant?.innovativeWork?.trim();
  const innovLine =
    innovative && innovative.length <= 100 && !proof.includes(innovative)
      ? `On the side I'm ${innovative.charAt(0).toLowerCase()}${innovative.slice(1)}${innovative.endsWith(".") ? "" : "."}`
      : "";

  const stack = stackLine(req, profile);
  const extraCredibility = innovLine || learning || stack;

  const interestBlock = [why, companyLine].filter(Boolean).join(" ");

  let body = joinParagraphs([
    `Hi ${name},`,
    `I'm ${profile.name}, a ${profile.year} student at ${shortSchool(profile.school)} in ${profile.location}.`,
    interestBlock,
    proof,
    extraCredibility,
    schoolLine,
    `Would you have 15 minutes for a quick chat about your journey to ${company}? I'd really value your perspective.`,
    `Thanks,\n${profile.name}`,
  ]);

  if (wordCount(body) > BODY_WORD_MAX) {
    body = trimToWordLimit(body, BODY_WORD_MAX);
  }

  return {
    templateType,
    subject: sanitizeOutreachCopy(buildSubject(profile, person, company)),
    body: sanitizeOutreachCopy(body),
  };
}

export function generateFollowup(
  req: GenerateFollowupRequest
): GenerateFollowupResponse {
  const first = firstName(req.person.name);
  const company = companyLabel(req.person.company);
  const profile = normalizeStudentProfile(req.student);
  const team = shortTeam(
    req.outreachContext?.company?.productsAndTeams[0] ?? req.person.team
  );
  const project =
    req.outreachContext?.applicant?.projects?.find((p) => p.name && p.description) ??
    normalizeStudentProfile(req.student).projects.find((p) => p.name && p.description);

  const proof = project
    ? ` I'm still excited about ${project.name} and how it relates to work on ${team}.`
    : "";

  const school = shortSchool(profile.school);

  return {
    subject: sanitizeOutreachCopy(
      clampText(`Re: follow-up, ${school}`, SUBJECT_MAX)
    ),
    body: sanitizeOutreachCopy(
      joinParagraphs([
        `Hi ${first},`,
        `Just bumping my note from ${req.daysSinceContact} days ago. Totally understand if you're busy.${proof}`,
        `I'd still appreciate 15 minutes to hear about your path to ${team} at ${company}.`,
        `Thanks again,\n${profile.name}`,
      ])
    ),
  };
}
