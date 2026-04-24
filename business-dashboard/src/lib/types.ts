// Pure types and constants — safe to import from client components.
// Do not import this file from anywhere that needs the database itself;
// import from @/lib/db for that.

export type Contact = {
  id: number;
  name: string;
  email: string | null;
  company: string | null;
  role: string | null;
  source: string | null;
  notes: string | null;
  pipeline_stage: string;
  last_touch_at: string | null;
  next_action: string | null;
  next_action_due: string | null;
  created_at: string;
  updated_at: string;
};

export type Interaction = {
  id: number;
  contact_id: number;
  kind: "email" | "meeting" | "call" | "note";
  summary: string | null;
  occurred_at: string;
  source_id: string | null;
  created_at: string;
};

export const PIPELINE_STAGES = [
  "networking",
  "warm",
  "in-conversation",
  "proposal",
  "client",
  "dormant",
] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];
