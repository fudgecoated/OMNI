import type { OutreachContext } from "@hermes/shared";
import { buildOutreachGuidance } from "./outreachGuidance";

/** Attach personalized guidance to a search pin context. */
export function enrichOutreachContext(ctx: OutreachContext): OutreachContext {
  return {
    ...ctx,
    guidance: buildOutreachGuidance(ctx),
  };
}
