# Executive Upskill shared sessions

Every planned F3 Insights session, as it appears on the Executive Upskill calendar (executiveupskill.live/sessions), reconciled against the F3i events website.

Reconciled 2026-11-05 (evening PT) against `https://f3insights.com/api/events` (60 events), the live Executive Upskill calendar feed (`/sessions/calendar.ics`), the live `/sessions` page, the site's backup copy (`src/content/events-snapshot.json`) and the Craft First plan (`marcom_events.md`). F3i is the system of record; this file is a point-in-time copy. To refresh it, rerun the reconciliation rather than editing rows by hand.

## Reconciliation result

| Check | Result |
|---|---|
| Upcoming F3i sessions (not cancelled) | 41 |
| On the live Executive Upskill calendar feed | 41 of 41. Match |
| Extra events in the feed that F3i doesn't have | 0 |
| On the live `/sessions` page (all 60 events, past included) | 60 of 60. Match |
| In the site's backup copy | 60 of 60. Match (refreshed 2026-11-05) |
| Craft First slugs in `marcom_events.md` found on F3i | 4 of 5. Mismatch |
| Craft First start times that agree with the plan | 0 of 5. Mismatch, see Findings |
| Cancelled sessions | 0 (hidden on Executive Upskill) |
| Price | All 60 are free on F3i (`isAccessibleForFree: true`, price 0), so the Executive Upskill "free" copy holds |
| Past sessions (still on F3i, shown on `/sessions` under "Show past sessions") | 19 |

## Findings to act on

1. **Craft First session 1 is gone from F3i.** "Where the Hours Go: Mapping Your Content Pipeline" (`where-the-hours-go-mapping-your-content-pipeline-lbfqvd`) now returns 404 on f3insights.com. Anyone who registered or subscribed should hear about it. If it was removed on purpose, update `marcom_events.md`.
2. **Two new webinars are on F3i but not in the Craft First plan:** "Set Up Your Local Agentic System" (Fri Nov 20) and "Write Your First Skill File" (Tue Nov 24), both 1:00-2:00 PM PST. Decide whether they belong to the series, and add them to `marcom_events.md` if so.
3. **Every remaining Craft First session moved** to 1:00-2:00 PM PST, and three moved a day earlier: Video Without the Editing Bay (Jan 6), Distribution Without the Copy-Paste (Jan 27), Keeping It Yours (Feb 17). One Idea, Every Format stays on Dec 10. The plan still says Thursdays at 10:00 AM.
4. **F3i re-tagged the webinars** with new topics (`ai-leadership`, `ai-enablement`) and no longer marks them `revenue-marketing`. The Executive Upskill site now files every F3i session with format Webinar under a **Webinars** filter, which no longer depends on topic tags. The Creative filter has no sessions and is hidden until one qualifies.
5. "Red-Teaming Decisions with AI Agents" (Nov 5) has ended and now sits under past sessions.

## Summary by series

| Series | Sessions | Dates | Format | Shown on Executive Upskill as |
|---|---|---|---|---|
| Craft First | 4 | Thu Dec 10, 2026 to Wed Feb 17, 2027 | Webinar | Webinars |
| Webinar, not in the Craft First plan | 2 | Fri Nov 20, 2026 to Tue Nov 24, 2026 | Webinar | Webinars |
| Q1 2027 Cohort | 10 | Mon Jan 11, 2027 to Mon Mar 15, 2027 | Workshop | Finance, Productivity |
| Q1 2027 Cohort office hours | 10 | Fri Jan 15, 2027 to Fri Mar 19, 2027 | Office Hours | Weekly meetup |
| Coffee and AI Coding | 8 | Sat Nov 7, 2026 to Sat Dec 26, 2026 | Office Hours | Weekly meetup |
| Standalone | 7 | Thu Nov 19, 2026 to Thu Feb 18, 2027 | Workshop | Finance, Productivity |

## Executive Upskill events not on F3i

| Date | Time | Event | Where |
|---|---|---|---|
| Wed Nov 18, 2026 | 11:00 AM-12:30 PM PST | Executive Upskill premiere | YouTube Live. Set by `NEXT_PUBLIC_PREMIERE_AT`; not an F3i event and not in the sessions feed |

## All upcoming sessions

Times are Pacific. Status is F3i's: open, limited (few seats left) or full. Full sessions show "Full" on Executive Upskill instead of a register button. Register at `https://f3insights.com/events/<slug>`.


### November 2026

| Date | Time | Title | Series | Format | EU category | Seats | Status | F3i slug |
|---|---|---|---|---|---|---|---|---|
| Sat Nov 7, 2026 | 8:30-10:00 AM PST | Coffee and AI Coding | Coffee and AI Coding | Office Hours | Weekly meetup | 10 | limited | [`coffee-and-ai-coding-dklvih`](https://f3insights.com/events/coffee-and-ai-coding-dklvih) |
| Sat Nov 14, 2026 | 8:30-10:00 AM PST | Coffee and AI Coding | Coffee and AI Coding | Office Hours | Weekly meetup | 10 | limited | [`coffee-and-ai-coding-0q527t`](https://f3insights.com/events/coffee-and-ai-coding-0q527t) |
| Thu Nov 19, 2026 | 4:30-5:00 PM PST | Automated Meeting Notes (Voice and Transcripts) | Standalone | Workshop | Productivity | 10 | limited | [`automated-meeting-notes-rdc7u0`](https://f3insights.com/events/automated-meeting-notes-rdc7u0) |
| Fri Nov 20, 2026 | 1:00-2:30 PM PST | Set Up Your Local Agentic System | Webinar, not in the Craft First plan | Webinar | Webinars | 30 | open | [`set-up-your-local-agentic-system-v1kmo4`](https://f3insights.com/events/set-up-your-local-agentic-system-v1kmo4) |
| Sat Nov 21, 2026 | 8:30-10:00 AM PST | Coffee and AI Coding | Coffee and AI Coding | Office Hours | Weekly meetup | 10 | limited | [`coffee-and-ai-coding-kqy29a`](https://f3insights.com/events/coffee-and-ai-coding-kqy29a) |
| Tue Nov 24, 2026 | 1:00-2:00 PM PST | Write Your First Skill File | Webinar, not in the Craft First plan | Webinar | Webinars | 30 | open | [`write-your-first-skill-file-nxzczb`](https://f3insights.com/events/write-your-first-skill-file-nxzczb) |
| Sat Nov 28, 2026 | 8:30-10:00 AM PST | Coffee and AI Coding | Coffee and AI Coding | Office Hours | Weekly meetup | 10 | limited | [`coffee-and-ai-coding-pczndl`](https://f3insights.com/events/coffee-and-ai-coding-pczndl) |

### December 2026

| Date | Time | Title | Series | Format | EU category | Seats | Status | F3i slug |
|---|---|---|---|---|---|---|---|---|
| Thu Dec 3, 2026 | 4:30-5:00 PM PST | Task and Project Visibility | Standalone | Workshop | Finance | 10 | limited | [`task-and-project-visibility-6tqfmg`](https://f3insights.com/events/task-and-project-visibility-6tqfmg) |
| Sat Dec 5, 2026 | 8:30-10:00 AM PST | Coffee and AI Coding | Coffee and AI Coding | Office Hours | Weekly meetup | 10 | limited | [`coffee-and-ai-coding-6uewuf`](https://f3insights.com/events/coffee-and-ai-coding-6uewuf) |
| Thu Dec 10, 2026 | 1:00-2:00 PM PST | One Idea, Every Format: Production Without the Resizing | Craft First | Webinar | Webinars | 30 | open | [`one-idea-every-format-production-without-the-resizing-l9m66z`](https://f3insights.com/events/one-idea-every-format-production-without-the-resizing-l9m66z) |
| Sat Dec 12, 2026 | 8:30-10:00 AM PST | Coffee and AI Coding | Coffee and AI Coding | Office Hours | Weekly meetup | 10 | limited | [`coffee-and-ai-coding-cd96fu`](https://f3insights.com/events/coffee-and-ai-coding-cd96fu) |
| Wed Dec 16, 2026 | 9:00-9:30 AM PST | AI for Email Drafting | Standalone | Workshop | Finance | 10 | limited | [`ai-for-email-drafting-aelqaa`](https://f3insights.com/events/ai-for-email-drafting-aelqaa) |
| Sat Dec 19, 2026 | 8:30-10:00 AM PST | Coffee and AI Coding | Coffee and AI Coding | Office Hours | Weekly meetup | 10 | limited | [`coffee-and-ai-coding-xannqu`](https://f3insights.com/events/coffee-and-ai-coding-xannqu) |
| Sat Dec 26, 2026 | 8:30-10:00 AM PST | Coffee and AI Coding | Coffee and AI Coding | Office Hours | Weekly meetup | 10 | limited | [`coffee-and-ai-coding-wdg4jt`](https://f3insights.com/events/coffee-and-ai-coding-wdg4jt) |

### January 2027

| Date | Time | Title | Series | Format | EU category | Seats | Status | F3i slug |
|---|---|---|---|---|---|---|---|---|
| Wed Jan 6, 2027 | 1:00-2:00 PM PST | Video Without the Editing Bay | Craft First | Webinar | Webinars | 30 | open | [`video-without-the-editing-bay-v2g060`](https://f3insights.com/events/video-without-the-editing-bay-v2g060) |
| Thu Jan 7, 2027 | 4:30-5:00 PM PST | Orchestrating Agents for Daily Work | Standalone | Workshop | Productivity | 10 | limited | [`orchestrating-agents-for-daily-work-pvcjar`](https://f3insights.com/events/orchestrating-agents-for-daily-work-pvcjar) |
| Mon Jan 11, 2027 | 9:00-10:30 AM PST | Q1 2027 Cohort: AI for Business Executives, | Q1 2027 Cohort | Workshop | Productivity | 30 | limited | [`q1-2027-cohort-ai-for-business-executives-3m265b`](https://f3insights.com/events/q1-2027-cohort-ai-for-business-executives-3m265b) |
| Fri Jan 15, 2027 | 1:00-2:30 PM PST | Q1 Cohort: Office Hours | Q1 2027 Cohort office hours | Office Hours | Weekly meetup | 30 | limited | [`q1-cohort-office-hours-im9f3p`](https://f3insights.com/events/q1-cohort-office-hours-im9f3p) |
| Mon Jan 18, 2027 | 9:00-10:30 AM PST | Q1 2027 Cohort: AI for Business Executives | Q1 2027 Cohort | Workshop | Finance | 30 | limited | [`q1-2027-cohort-ai-for-business-executives-vhfee8`](https://f3insights.com/events/q1-2027-cohort-ai-for-business-executives-vhfee8) |
| Thu Jan 21, 2027 | 4:30-5:00 PM PST | AI and Excel for Forecasting | Standalone | Workshop | Finance | 10 | limited | [`ai-and-excel-for-forecasting-ftar2m`](https://f3insights.com/events/ai-and-excel-for-forecasting-ftar2m) |
| Fri Jan 22, 2027 | 1:00-2:30 PM PST | Q1 Cohort: Office Hours | Q1 2027 Cohort office hours | Office Hours | Weekly meetup | 30 | limited | [`q1-cohort-office-hours-k4jdmc`](https://f3insights.com/events/q1-cohort-office-hours-k4jdmc) |
| Mon Jan 25, 2027 | 9:00-10:30 AM PST | Q1 2027 Cohort: AI for Business Executives | Q1 2027 Cohort | Workshop | Finance | 30 | limited | [`q1-2027-cohort-ai-for-business-executives-vjr81m`](https://f3insights.com/events/q1-2027-cohort-ai-for-business-executives-vjr81m) |
| Wed Jan 27, 2027 | 1:00-2:00 PM PST | Distribution Without the Copy-Paste | Craft First | Webinar | Webinars | 30 | open | [`distribution-without-the-copy-paste-q4xahd`](https://f3insights.com/events/distribution-without-the-copy-paste-q4xahd) |
| Fri Jan 29, 2027 | 1:00-2:30 PM PST | Q1 Cohort: Office Hours | Q1 2027 Cohort office hours | Office Hours | Weekly meetup | 30 | limited | [`q1-cohort-office-hours-goft0s`](https://f3insights.com/events/q1-cohort-office-hours-goft0s) |

### February 2027

| Date | Time | Title | Series | Format | EU category | Seats | Status | F3i slug |
|---|---|---|---|---|---|---|---|---|
| Mon Feb 1, 2027 | 9:00-10:30 AM PST | Q1 2027 Cohort: AI for Business Executives | Q1 2027 Cohort | Workshop | Finance | 30 | limited | [`q1-2027-cohort-ai-for-business-executives-37lnus`](https://f3insights.com/events/q1-2027-cohort-ai-for-business-executives-37lnus) |
| Wed Feb 3, 2027 | 9:00-9:30 AM PST | AI for Executive Reporting | Standalone | Workshop | Finance | 10 | limited | [`ai-for-executive-reporting-e9aomx`](https://f3insights.com/events/ai-for-executive-reporting-e9aomx) |
| Fri Feb 5, 2027 | 1:00-2:30 PM PST | Q1 Cohort: Office Hours | Q1 2027 Cohort office hours | Office Hours | Weekly meetup | 30 | limited | [`q1-cohort-office-hours-0po6y8`](https://f3insights.com/events/q1-cohort-office-hours-0po6y8) |
| Mon Feb 8, 2027 | 9:00-10:30 AM PST | Q1 2027 Cohort: AI for Business Executives | Q1 2027 Cohort | Workshop | Finance | 30 | limited | [`q1-2027-cohort-ai-for-business-executives-vxc0fl`](https://f3insights.com/events/q1-2027-cohort-ai-for-business-executives-vxc0fl) |
| Fri Feb 12, 2027 | 1:00-2:30 PM PST | Q1 Cohort: Office Hours | Q1 2027 Cohort office hours | Office Hours | Weekly meetup | 30 | limited | [`q1-cohort-office-hours-3mkc19`](https://f3insights.com/events/q1-cohort-office-hours-3mkc19) |
| Mon Feb 15, 2027 | 9:00-10:30 AM PST | Q1 2027 Cohort: AI for Business Executives | Q1 2027 Cohort | Workshop | Finance | 30 | limited | [`q1-2027-cohort-ai-for-business-executives-u2xlh4`](https://f3insights.com/events/q1-2027-cohort-ai-for-business-executives-u2xlh4) |
| Wed Feb 17, 2027 | 1:00-2:00 PM PST | Keeping It Yours: Light Quality Checks for a Small Team | Craft First | Webinar | Webinars | 30 | open | [`keeping-it-yours-light-quality-checks-for-a-small-team-se5i7u`](https://f3insights.com/events/keeping-it-yours-light-quality-checks-for-a-small-team-se5i7u) |
| Thu Feb 18, 2027 | 4:30-5:00 PM PST | Organizing Data for AI | Standalone | Workshop | Finance | 10 | limited | [`organizing-data-for-ai-ch74zd`](https://f3insights.com/events/organizing-data-for-ai-ch74zd) |
| Fri Feb 19, 2027 | 1:00-2:30 PM PST | Q1 Cohort: Office Hours | Q1 2027 Cohort office hours | Office Hours | Weekly meetup | 30 | limited | [`q1-cohort-office-hours-65ah44`](https://f3insights.com/events/q1-cohort-office-hours-65ah44) |
| Mon Feb 22, 2027 | 9:00-10:30 AM PST | Q1 2027 Cohort: AI for Business Executives | Q1 2027 Cohort | Workshop | Finance | 30 | limited | [`q1-2027-cohort-ai-for-business-executives-rv7q55`](https://f3insights.com/events/q1-2027-cohort-ai-for-business-executives-rv7q55) |
| Fri Feb 26, 2027 | 1:00-2:30 PM PST | Q1 Cohort: Office Hours | Q1 2027 Cohort office hours | Office Hours | Weekly meetup | 30 | limited | [`q1-cohort-office-hours-28cqqh`](https://f3insights.com/events/q1-cohort-office-hours-28cqqh) |

### March 2027

| Date | Time | Title | Series | Format | EU category | Seats | Status | F3i slug |
|---|---|---|---|---|---|---|---|---|
| Mon Mar 1, 2027 | 9:00-10:30 AM PST | Q1 2027 Cohort: AI for Business Executives | Q1 2027 Cohort | Workshop | Finance | 30 | limited | [`q1-2027-cohort-ai-for-business-executives-kekdgv`](https://f3insights.com/events/q1-2027-cohort-ai-for-business-executives-kekdgv) |
| Fri Mar 5, 2027 | 1:00-2:30 PM PST | Q1 Cohort: Office Hours | Q1 2027 Cohort office hours | Office Hours | Weekly meetup | 30 | limited | [`q1-cohort-office-hours-0c1fzp`](https://f3insights.com/events/q1-cohort-office-hours-0c1fzp) |
| Mon Mar 8, 2027 | 9:00-10:30 AM PST | Q1 2027 Cohort: AI for Business Executives | Q1 2027 Cohort | Workshop | Finance | 30 | limited | [`q1-2027-cohort-ai-for-business-executives-b7oxri`](https://f3insights.com/events/q1-2027-cohort-ai-for-business-executives-b7oxri) |
| Fri Mar 12, 2027 | 1:00-2:30 PM PST | Q1 Cohort: Office Hours | Q1 2027 Cohort office hours | Office Hours | Weekly meetup | 30 | limited | [`q1-cohort-office-hours-sssxeh`](https://f3insights.com/events/q1-cohort-office-hours-sssxeh) |
| Mon Mar 15, 2027 | 9:00-10:30 AM PDT | Q1 2027 Cohort: AI for Business Executives | Q1 2027 Cohort | Workshop | Finance | 30 | limited | [`q1-2027-cohort-ai-for-business-executives-rj4qqg`](https://f3insights.com/events/q1-2027-cohort-ai-for-business-executives-rj4qqg) |
| Fri Mar 19, 2027 | 1:00-2:30 PM PDT | Q1 Cohort: Office Hours | Q1 2027 Cohort office hours | Office Hours | Weekly meetup | 30 | limited | [`q1-cohort-office-hours-binr1y`](https://f3insights.com/events/q1-cohort-office-hours-binr1y) |

## Craft First series (plan vs F3i)

| # | Slug (same in plan and F3i) | Planned start (`marcom_events.md`) | Start on F3i | Agrees | EU category |
|---|---|---|---|---|---|
| 1 | `where-the-hours-go-mapping-your-content-pipeline-lbfqvd` | `2026-11-19T10:00:00-08:00` | **Removed from F3i** | **No** |  |
| 2 | `one-idea-every-format-production-without-the-resizing-l9m66z` | `2026-12-10T10:00:00-08:00` | `2026-12-10T13:00:00-08:00` | **No** | Webinars |
| 3 | `video-without-the-editing-bay-v2g060` | `2027-01-07T10:00:00-08:00` | `2027-01-06T13:00:00-08:00` | **No** | Webinars |
| 4 | `distribution-without-the-copy-paste-q4xahd` | `2027-01-28T10:00:00-08:00` | `2027-01-27T13:00:00-08:00` | **No** | Webinars |
| 5 | `keeping-it-yours-light-quality-checks-for-a-small-team-se5i7u` | `2027-02-18T10:00:00-08:00` | `2027-02-17T13:00:00-08:00` | **No** | Webinars |
