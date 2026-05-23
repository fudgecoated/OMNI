# HERMES - PRODUCT IDEA DOCUMENT (PRD)

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Date** | 2026-05-23 |
| **Status** | Hackathon MVP |
| **Persona** | Calgary SWE Undergrad → Big Tech |

---

## 1. THE PROBLEM (Caveman Words)

### What Wrong?

- Student graduate. Want job.
- Student apply to many company. Nobody reply.
- Student sad. No referral. No network.

### Why Nobody Reply?

- Student not know **WHO** to message
- Student not know **WHAT** to say
- Student forget follow-up

### What Big Company Do?

- Many job application come
- Recruiter ignore most
- Referral get attention (referral = friend inside company)

### What Student Need?

- Find right people at company
- Write **GOOD** message (not boring)
- Remember follow-up after 5 days

---

## 2. THE SOLUTION

**Hermes = 3 Things**

1. **People Finder** — Find right people at company
2. **Message Writer** — Write personalized message for each person
3. **Follow-up Machine** — Remind student after 5 days, write follow-up

### How Hermes Different?

| Other Tool | Hermes |
|------------|--------|
| Find job posting | Find **PEOPLE** (more important) |
| Generic message | Personal message (school, experience, domain) |
| No follow-up | Automatic follow-up reminder |
| Not for student | Built for Calgary SWE undergrad |

---

## 3. WHO IS THIS FOR?

### Primary Persona: "The Calgary SWE Undergrad"

**Demographics:**

- **Age:** 20-25
- **Location:** Calgary, Alberta
- **Education:** Computer Engineering/Software Engineering at UCalgary
- **Goal:** Land internship or new grad role at Big Tech (Google, Meta, Amazon, etc.)

**Pain Points:**

- No network in tech industry
- Applying online feels like shouting into void
- Doesn't know anyone at target companies
- Struggles with cold outreach messaging
- Gets ghosted after applications

**Success Metric:**

- Gets response from employee at target company
- Converts response → referral → interview

---

## 4. CORE FEATURES

### Feature 1: People Finder 🔍

**What it does:**

- Takes company name → returns list of relevant employees
- Filters by: role, team, school connection, location

**Data Sources:**

- LinkedIn public profiles (scraped)
- Alumni databases (UCalgary alumni network)
- GitHub contributors (for engineering roles)

**Output:**

- Person name
- Role & team
- School connection (if any)
- Contact method (LinkedIn, email if available)
- "Relevance score" (how related to student's interests)

**Implementation:**

- Web scraper for LinkedIn (respecting robots.txt, using proper delays)
- Alumni network CSV integration
- API for People Data Labs or similar (if budget allows)

### Feature 2: Message Writer ✍️

**What it does:**

Generates personalized cold message based on:

- Person's background
- Student's background
- Shared connection (school, interests, domain)

**Message Types:**

- **LinkedIn Connection Request** — short note (300 char limit)
- **LinkedIn Message** — longer message (first degree)
- **Email** — formal email template

**Personalization Factors:**

- School connection ("I see you're also a UCalgary grad!")
- Domain match ("Your work in distributed systems is exactly what I'm passionate about")
- Project match ("Your team's work on X inspired my project Y")
- Local connection ("Calgary represent! 🍁")

**LLM Integration:**

- Use GPT-4 or Claude API for message generation
- Include examples of successful cold messages in prompt
- Student can iterate on message tone

**Example Output:**

```
Subject: UCalgary SWE Student → Distributed Systems Fan → Would Love 15 Min

Hi [Name],

I'm a 3rd-year Software Engineering student at UCalgary. Your work 
on distributed systems at [Company] caught my attention—specifically 
your team's approach to [specific topic].

I built a mini distributed key-value store inspired by [their project/tech].
Here's the GitHub: [link]

Would you have 15 minutes to chat about your path from UCalgary to [Company]?

Thanks,
[Student Name]
Calgary, AB 🇨🇦
```

### Feature 3: Follow-up Machine ⏰

**What it does:**

- Tracks who student has contacted
- Reminds after X days (default: 5)
- Generates follow-up message

**Follow-up Logic:**

- If no response after 5 days → send polite nudge
- If no response after 10 days → mark as "unlikely" and suggest new contact
- If response received → log success, celebrate 🎉

**Storage:**

- Local database (SQLite) or simple JSON file
- Tracks: company, person, message sent, date, status

---

## 5. TECHNICAL ARCHITECTURE

### Stack Choice

| Component | Technology |
|-----------|------------|
| Frontend | Streamlit (Python) — fast prototyping |
| Backend | Flask API |
| Database | SQLite (local) |
| Scraping | BeautifulSoup + requests + proxies |
| LLM | OpenAI GPT-4 API |
| Auth | None (MVP — single user) |

### File Structure

```
hermes/
├── app.py                 # Streamlit UI
├── finder/
│   ├── linkedin_scraper.py
│   ├── alumni_finder.py
│   └── relevance_scorer.py
├── writer/
│   ├── message_generator.py
│   └── templates/
│       ├── connection_request.txt
│       └── cold_email.txt
├── tracker/
│   ├── database.py
│   └── followup_scheduler.py
├── config/
│   └── settings.yaml
└── requirements.txt
```

---

## 6. MVP SCOPE

### In Scope (Hackathon Weekend)

- [ ] People Finder for 3 target companies (Google, Amazon, Meta)
- [ ] LinkedIn scraper (limited, respectful)
- [ ] Message Writer with 2 templates
- [ ] Follow-up reminder system (local notifications)
- [ ] Simple Streamlit UI

### Out of Scope (Future)

- ❌ Auto-sending messages (user copies and pastes)
- ❌ Email integration
- ❌ Multi-user support
- ❌ Mobile app
- ❌ Payment/billing

---

## 7. RISKS & MITIGATIONS

| Risk | Mitigation |
|------|------------|
| LinkedIn anti-scraping | Use delays, respectful crawling, manual fallback |
| LLM hallucination | Human reviews all messages before sending |
| Data privacy | All data stored locally, nothing sent to cloud |
| No alumni data access | Start with manual CSV, partner with UCalgary later |
| Burn rate (API costs) | Use GPT-3.5 for drafts, GPT-4 only when needed |

---

## 8. SUCCESS METRICS

### Hackathon Demo Success

- Given company name → show 5 relevant people
- Given person + student info → generate message
- Show follow-up schedule dashboard

### Real-World Success (Post-Hackathon)

- **Metric 1:** Response rate on cold messages (>5%)
- **Metric 2:** Referrals generated (>1)
- **Metric 3:** Positive user feedback ("Wow, this saved me!")

---

## 9. TEAM & TIMELINE

### Hackathon Roles

| Person | Role | Timebox |
|--------|------|---------|
| Person A | Backend + Scraping | 6 hours |
| Person B | Frontend + UX | 6 hours |
| Person C | LLM Integration + Testing | 6 hours |
| Everyone | Demo prep + Pitch | 2 hours |

### Hackathon Timeline (24 hours)

| Hours | Focus |
|-------|-------|
| 0-6 | Build core (scraper, message gen, basic UI) |
| 6-12 | Polish (UI, follow-up system, error handling) |
| 12-18 | Testing + edge cases |
| 18-24 | Demo prep + pitching |

---

## 10. POST-HACKATHON ROADMAP

### Phase 1: Stability (Week 1-2)

- Fix bugs from demo feedback
- Add proper error handling
- Improve scraper reliability

### Phase 2: Alumni Integration (Week 3-4)

- Partner with UCalgary Engineering Co-op office
- Get alumni CSV data
- Build proper alumni matching

### Phase 3: Multi-User (Month 2)

- Add authentication
- Cloud database (PostgreSQL)
- Deploy on Streamlit Cloud or Vercel

### Phase 4: Expansion (Month 3+)

- Expand to other universities
- Add email integration
- Build Chrome extension for LinkedIn

---

## 11. APPENDIX

### A. Sample Database Schema

```sql
CREATE TABLE contacts (
    id INTEGER PRIMARY KEY,
    company TEXT NOT NULL,
    person_name TEXT NOT NULL,
    person_role TEXT,
    linkedin_url TEXT,
    school_connection TEXT,
    status TEXT DEFAULT 'pending',
    first_contact_date DATE,
    followup_date DATE,
    notes TEXT
);
```

### B. Example Successful Cold Message (Anonymized)

**Subject:** UCalgary Grad → Cloud Infrastructure → Coffee Chat?

> Hi Sarah,
>
> I noticed you went from UCalgary CompE to AWS—exactly the path I'm hoping to follow. Your work on the Elastic Container Service team caught my attention.
>
> I've been building containerized microservices (GitHub link) and would love to pick your brain on how you developed the systems design skills for that role.
>
> Would you have 20 minutes for a virtual coffee?
>
> Thanks,  
> [Student]

**Result:** Response received in 3 days → 30-min call scheduled

### C. Competitive Landscape

| Tool | What it does | Gap Hermes fills |
|------|--------------|------------------|
| LinkedIn Job Search | Find job postings | Hermes finds **PEOPLE** |
| Hunter.io | Find email addresses | Hermes writes message |
| Calendly | Schedule meetings | Hermes focuses on outreach |
| Cold Email Tools | Send bulk emails | Hermes is personalized, not spammy |

---

## 12. ACKNOWLEDGMENTS

- Built at [Hackathon Name] 2026
- Inspired by struggling Calgary SWE students everywhere
- Special thanks to UCalgary Engineering Co-op office (future partnership)

---

## THE END

> "The job search is broken. Hermes fixes it by connecting students to the people who actually make a difference—employees at their dream companies."
