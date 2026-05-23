import type {
  GenerateFollowupRequest,
  GenerateFollowupResponse,
  GenerateMessageRequest,
  GenerateMessageResponse,
} from "@hermes/shared";

function companyLabel(company: string): string {
  const labels: Record<string, string> = {
    google: "Google",
    amazon: "Amazon",
    meta: "Meta",
  };
  return labels[company] ?? company;
}

/** Stub generator — replace with callLLM + templates in AI milestone. */
export function generateMessage(
  req: GenerateMessageRequest
): GenerateMessageResponse {
  const { person, student, templateType } = req;
  const company = companyLabel(person.company);
  const schoolLine = person.schoolConnection
    ? `I see you're also connected to ${person.schoolConnection} — that path really resonates with me.`
    : `Your work on ${person.team} at ${company} caught my attention.`;

  if (templateType === "connection_request") {
    return {
      templateType,
      subject: "",
      body: `Hi ${person.name.split(" ")[0]}, I'm ${student.name}, a ${student.year} ${student.school} student interested in ${student.targetRole}. ${schoolLine} Would love to connect!`,
    };
  }

  return {
    templateType,
    subject: `${student.school} SWE → ${person.team} → 15 min chat?`,
    body: `Hi ${person.name.split(" ")[0]},

I'm ${student.name}, a ${student.year} student at ${student.school} in ${student.location}. ${schoolLine}

I've been exploring ${student.interests.join(", ")} and built projects on GitHub (${student.githubUrl}).

Would you have 15 minutes to chat about your path from school to ${company}?

Thanks,
${student.name}`,
  };
}

export function generateFollowup(
  req: GenerateFollowupRequest
): GenerateFollowupResponse {
  const first = req.person.name.split(" ")[0];
  return {
    subject: `Re: Quick follow-up — ${req.student.school} student`,
    body: `Hi ${first},

Just bumping my note from ${req.daysSinceContact} days ago — totally understand if you're busy. I'd still love 15 minutes to learn about your work on ${req.person.team}.

Thanks again,
${req.student.name}`,
  };
}
