# Setup Guide

## 1. Create a Supabase project
Go to https://supabase.com → New Project.

## 2. Create the tables
In Supabase SQL Editor, run:

```sql
create table workshops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  date date not null,
  organizer text,
  admin_password text not null,
  created_at timestamp default now()
);

create table attendance (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid references workshops(id) on delete cascade,
  roll_no text not null,
  name text not null,
  unique(workshop_id, roll_no)
);

-- Enable public read/write via anon key (simple setup; tighten later if needed)
alter table workshops enable row level security;
alter table attendance enable row level security;

create policy "public read workshops" on workshops for select using (true);
create policy "public insert workshops" on workshops for insert with check (true);

create policy "public read attendance" on attendance for select using (true);
create policy "public insert attendance" on attendance for insert with check (true);
create policy "public delete attendance" on attendance for delete using (true);
```

## 3. Get your API keys
Supabase Dashboard → Project Settings → API:
- `Project URL`
- `anon public` key

## 4. Set environment variables
Create `.env.local` (for local dev) with:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

When deploying to Vercel, add the same two variables under
Project → Settings → Environment Variables.

## 5. Run locally
```
npm install
npm run dev
```

## 6. Deploy
Push this folder to a GitHub repo, then import it in Vercel
(same flow as your ride-with-dodo project). Add the env vars in
Vercel's dashboard before the first deploy.

## Usage flow
1. Go to `/admin`, create a workshop (name, date, set a simple admin
   password), upload the attendance CSV/Excel (columns: `roll_no`, `name`).
2. Share the student link `/` (or `/workshop/<id>`) with students.
3. Student enters roll number → if present, certificate generates and
   downloads as PDF. If absent, they see a clear "not eligible" message.

## CSV/Excel format
Your uploaded file must have a header row with columns named
(case-insensitive, flexible): `roll_no` (or `roll no`, `roll number`)
and `name` (or `student name`).
