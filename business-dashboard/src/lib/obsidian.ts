import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

function vaultPath(): string | null {
  return process.env.OBSIDIAN_VAULT_PATH || null;
}

export function writeDailyBriefing(date: string, bodyMd: string): string | null {
  const vault = vaultPath();
  if (!vault) return null;
  const dir = join(vault, "Dashboard", "Daily Briefings");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const file = join(dir, `${date}.md`);
  const frontmatter = `---\ndate: ${date}\nsource: business-dashboard\n---\n\n`;
  writeFileSync(file, frontmatter + bodyMd, "utf8");
  return file;
}

export function writeContactNote(contact: {
  name: string;
  email: string | null;
  company: string | null;
  role: string | null;
  source: string | null;
  notes: string | null;
  pipeline_stage: string;
}): string | null {
  const vault = vaultPath();
  if (!vault) return null;
  const dir = join(vault, "Dashboard", "Contacts");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const safeName = contact.name.replace(/[\\/:*?"<>|]/g, "-").trim();
  const file = join(dir, `${safeName}.md`);

  const frontmatter = [
    "---",
    `name: ${contact.name}`,
    `email: ${contact.email ?? ""}`,
    `company: ${contact.company ?? ""}`,
    `role: ${contact.role ?? ""}`,
    `source: ${contact.source ?? ""}`,
    `pipeline_stage: ${contact.pipeline_stage}`,
    "tags: [contact, dashboard]",
    "---",
    "",
  ].join("\n");

  const body = contact.notes ? `\n## Notes\n\n${contact.notes}\n` : "";

  if (existsSync(file)) {
    // Don't clobber existing notes — preserve any user-added content below frontmatter.
    const existing = readFileSync(file, "utf8");
    const fmEnd = existing.indexOf("---", 4);
    const userBody = fmEnd >= 0 ? existing.slice(fmEnd + 3) : existing;
    writeFileSync(file, frontmatter + userBody, "utf8");
  } else {
    writeFileSync(file, frontmatter + body, "utf8");
  }
  return file;
}
