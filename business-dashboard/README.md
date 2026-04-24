# Business Dashboard

A local web app that gives you one daily view of your business: today's meetings,
inbox triage, follow-ups due, and an AI-generated strategic briefing. Runs on
your Mac, talks directly to Google (Gmail + Calendar) and Claude. Writes daily
briefings and contact notes into your Obsidian JB Vault as markdown.

This is **Phase 1**. Scope: meetings, emails, contacts, follow-ups, briefing.
Finance, projects, and cold outreach come later, after this is real and useful.

---

## Setup (one time, ~30 minutes)

You need: a Mac, an internet connection, and willingness to copy-paste a few
things. You won't need to write any code.

### 1. Install Node.js

Open the **Terminal** app (Cmd+Space → "Terminal").

Check if Node is installed:

```bash
node --version
```

If you see something like `v20.x.x` or higher, skip ahead. If you get
"command not found", install Node:

- Go to <https://nodejs.org>
- Download the **LTS** version
- Run the installer

### 2. Get the project onto your Mac

In Terminal:

```bash
cd ~
git clone https://github.com/justblakemedia/superpowers.git
cd superpowers
git checkout claude/business-dashboard-crm-xLpd5
mv business-dashboard ~/business-dashboard
cd ~/business-dashboard
npm install
```

Last command takes a few minutes. It downloads everything the app needs.

### 3. Set up Google OAuth (for Gmail + Calendar access)

This is the most fiddly step. Follow it carefully.

1. Go to <https://console.cloud.google.com/>
2. Create a new project (top bar dropdown → "New Project"). Name it
   "Business Dashboard". Click Create.
3. With the project selected, go to **APIs & Services → Library**.
   - Search "Gmail API" → click → **Enable**
   - Search "Google Calendar API" → click → **Enable**
4. Go to **APIs & Services → OAuth consent screen**.
   - Choose **External** → Create
   - App name: `Business Dashboard`
   - User support email: your email
   - Developer email: your email
   - Save and continue through the next screens (no scopes need to be added
     here — leave defaults). On "Test users" add **your own Google email**.
5. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
   - Application type: **Web application**
   - Name: `Business Dashboard Local`
   - Authorized redirect URIs: add
     `http://localhost:3000/api/auth/callback/google`
   - Click Create
6. Copy the **Client ID** and **Client secret** that appear. You'll paste them
   in the next step.

### 4. Configure the app

Still in Terminal, in the `~/business-dashboard` folder:

```bash
cp .env.example .env.local
open -e .env.local
```

That opens the config file in TextEdit. Fill in:

- `GOOGLE_CLIENT_ID` — from step 3.6 above
- `GOOGLE_CLIENT_SECRET` — from step 3.6 above
- `NEXTAUTH_SECRET` — generate one in Terminal with:
  `openssl rand -base64 32` and paste the output
- `ANTHROPIC_API_KEY` — get from <https://console.anthropic.com/>
  (Settings → API Keys → Create Key)
- `OBSIDIAN_VAULT_PATH` — the **absolute path** to your JB Vault.
  In Finder, right-click the JB Vault folder → "Get Info" → look at "Where:"
  to find the path. Example: `/Users/blake/Documents/JB Vault`

Save and close TextEdit.

### 5. Initialize the database

```bash
npm run db:init
```

You should see `Initialized database at /Users/.../data/dashboard.db`.

### 6. Run it

```bash
npm run dev
```

Open <http://localhost:3000> in your browser. Sign in with the Google account
that has your work Gmail and Calendar.

That's it. You should see today's meetings, your inbox, and an empty
follow-ups list.

---

## Daily use

Open Terminal, run:

```bash
cd ~/business-dashboard
npm run dev
```

Open <http://localhost:3000> in your browser. Click **Generate briefing** to
get the day's strategic read. The briefing is saved to your JB Vault under
`Dashboard/Daily Briefings/YYYY-MM-DD.md`.

### Adding contacts after networking

Go to **Contacts → Add contact**. Fill in name, email, company, where you met
them, and any notes from the conversation. Each contact also gets a markdown
note in `JB Vault/Dashboard/Contacts/<name>.md` so you can link to it from
your other Obsidian notes.

### Drafting follow-ups

On the dashboard, the **Follow-ups due** section shows the 5 contacts most in
need of a touch (oldest last-touch first, dormant/client excluded). Click
**Draft email** — Claude generates a personalized follow-up based on the
contact's notes, last interaction, and your user context. Click **Save to
Gmail drafts** to put it in your Gmail drafts folder, where you can edit and
send.

---

## What's stored where

- **SQLite database** (`data/dashboard.db`) — contacts, interactions, briefings.
  Local to your Mac. Not synced anywhere unless you back it up.
- **Obsidian JB Vault** — daily briefings (`Dashboard/Daily Briefings/`) and
  contact notes (`Dashboard/Contacts/`). Each is a regular markdown file with
  frontmatter, so it integrates with your existing Obsidian setup.
- **Gmail** — drafts only. The app never sends mail.
- **Google Calendar** — read only. The app never creates or modifies events.

---

## What this doesn't do yet

Deliberately scoped out of Phase 1, will add once core works:

- Bank balance / revenue (needs Plaid integration)
- Project tracking for AI builds and infrastructure work
- Hours / time tracking
- Cold outreach to net-new leads
- Granola integration (meeting transcripts → contact notes)
- Pulling existing contacts from Gmail history automatically
- Pulling existing notes from your business brain / current Obsidian vault

When the core daily loop is helpful, we'll layer these in one at a time.

---

## Stopping the app

In the Terminal window where it's running, press `Ctrl+C`.

## Troubleshooting

**"redirect_uri_mismatch" when signing in** — the redirect URI in your Google
Cloud OAuth client must be exactly `http://localhost:3000/api/auth/callback/google`.
No trailing slash. Re-check step 3.5.

**"Access blocked: Business Dashboard has not completed verification"** — your
Google account needs to be added as a test user. Go back to step 3.4 and add
your email under "Test users".

**Briefing fails with "ANTHROPIC_API_KEY is not set"** — fill in the key in
`.env.local` and restart `npm run dev` (Ctrl+C, then run again).

**Vault path not working** — make sure `OBSIDIAN_VAULT_PATH` is the absolute
path (starts with `/Users/...`) and matches the JB Vault folder exactly,
including spaces. If the path has spaces, no quotes needed in `.env.local`.
