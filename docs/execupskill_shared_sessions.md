# Executive Upskill shared sessions

Every planned F3 Insights session, as it appears on the Executive Upskill calendar (executiveupskill.live/sessions), reconciled against the F3i events website.

Reconciled 2026-11-05 against `https://f3insights.com/api/events` (59 events), the live Executive Upskill calendar feed (`/sessions/calendar.ics`), the live `/sessions` page, the site's backup copy (`src/content/events-snapshot.json`) and the Craft First plan (`marcom_events.md`). F3i is the system of record; this file is a point-in-time copy. To refresh it, rerun the reconciliation rather than editing rows by hand.

## Reconciliation result

| Check | Result |
|---|---|
| Upcoming F3i sessions (not cancelled) | 41 |
| On the live Executive Upskill calendar feed | 41 of 41. Match |
| Extra events in the feed that F3i doesn't have | 0 |
| On the live `/sessions` page (all 59 events, past included) | 59 of 59. Match |
| In the site's backup copy | 40 of 59 before this check (the Q1 2027 Cohort was added to F3i after the Nov 2 refresh). Refreshed to 59 of 59 |
| Craft First slugs in `marcom_events.md` found on F3i | 5 of 5. Match |
| Craft First start times that agree with the plan | 0 of 5. **Mismatch**, see Findings |
| Cancelled sessions | 0 (hidden on Executive Upskill) |
| Price | All 59 are free on F3i (`isAccessibleForFree: true`, price 0), so the Executive Upskill "free" copy holds |
| Past sessions (still on F3i, shown on `/sessions` under "Show past sessions") | 18 |

## Findings to act on

1. **Craft First times differ from the plan (all five).** F3i has each session on a Wednesday at 1:00-2:00 PM PST. `marcom_events.md` plans Thursdays at 10:00-11:00 AM PST. The plan's change log records no move, so this is either an unlogged reschedule or a data-entry error on F3i. Session 1 now lands on the premiere day (Nov 18), 30 minutes after the premiere ends at 12:30 PM. Owner: James decides which is right; the F3i session fixes F3i or the plan to match. Executive Upskill follows F3i automatically.
2. **The Q1 2027 Cohort shows as "Finance" or "Productivity" on Executive Upskill.** Its sessions carry every F3i topic, so the category rule picks Finance for most. Its office hours show as "Weekly meetup", the same label as the open Coffee and AI Coding sessions, although they serve the cohort. Fix on Executive Upskill: add a "Cohort" category keyed on the slug prefix or the "Cohort" title, or have F3i narrow the cohort's topics.
3. **Backup copy refreshed.** `src/content/events-snapshot.json` held 40 of 59 events. It was refreshed from the F3i API on 2026-11-05 so the fallback includes the cohort. It goes live with the next deploy.

## Summary by series

| Series | Sessions | Dates | Format | Shown on Executive Upskill as |
|---|---|---|---|---|
| Craft First | 5 | Wed Nov 18, 2026 to Wed Feb 17, 2027 | Webinar | Creative |
| Q1 2027 Cohort | 10 | Mon Jan 11, 2027 to Mon Mar 15, 2027 | Workshop | Finance, Productivity |
| Q1 2027 Cohort office hours | 10 | Fri Jan 15, 2027 to Fri Mar 19, 2027 | Office Hours | Weekly meetup |
| Coffee and AI Coding | 8 | Sat Nov 7, 2026 to Sat Dec 26, 2026 | Office Hours | Weekly meetup |
| Standalone | 8 | Thu Nov 5, 2026 to Thu Feb 18, 2027 | Workshop | Finance, Productivity |

## Executive Upskill events not on F3i

| Date | Time | Event | Where |
|---|---|---|---|
| Wed Nov 18, 2026 | 11:00 AM-12:30 PM PST | Executive Upskill premiere | YouTube Live. Set by `NEXT_PUBLIC_PREMIERE_AT`; not an F3i event and not in the sessions feed |

## All upcoming sessions

Times are Pacific. Status is F3i's: open, limited (few seats left) or full. Full sessions show "Full" on Executive Upskill instead of a register button. Register at `https://f3insights.com/events/<slug>`.


### November 2026

| Date | Time | Title | Series | Format | EU category | Seats | Status | F3i slug |
|---|---|---|---|---|---|---|---|---|
| Thu Nov 5, 2026 | 4:30-5:00 PM PST | Red-Teaming Decisions with AI Agents | Standalone | Workshop | Productivity | 10 | full | [`red-teaming-decisions-with-ai-agents-imsufn`](https://f3insights.com/events/red-teaming-decisions-with-ai-agents-imsufn) |
| Sat Nov 7, 2026 | 8:30-10:00 AM PST | Coffee and AI Coding | Coffee and AI Coding | Office Hours | Weekly meetup | 10 | limited | [`coffee-and-ai-coding-dklvih`](https://f3insights.com/events/coffee-and-ai-coding-dklvih) |
| Sat Nov 14, 2026 | 8:30-10:00 AM PST | Coffee and AI Coding | Coffee and AI Coding | Office Hours | Weekly meetup | 10 | limited | [`coffee-and-ai-coding-0q527t`](https://f3insights.com/events/coffee-and-ai-coding-0q527t) |
| Wed Nov 18, 2026 | 1:00-2:00 PM PST | Where the Hours Go: Mapping Your Content Pipeline | Craft First | Webinar | Creative | 30 | open | [`where-the-hours-go-mapping-your-content-pipeline-lbfqvd`](https://f3insights.com/events/where-the-hours-go-mapping-your-content-pipeline-lbfqvd) |
| Thu Nov 19, 2026 | 4:30-5:00 PM PST | Automated Meeting Notes (Voice and Transcripts) | Standalone | Workshop | Productivity | 10 | limited | [`automated-meeting-notes-rdc7u0`](https://f3insights.com/events/automated-meeting-notes-rdc7u0) |
| Sat Nov 21, 2026 | 8:30-10:00 AM PST | Coffee and AI Coding | Coffee and AI Coding | Office Hours | Weekly meetup | 10 | limited | [`coffee-and-ai-coding-kqy29a`](https://f3insights.com/events/coffee-and-ai-coding-kqy29a) |
| Sat Nov 28, 2026 | 8:30-10:00 AM PST | Coffee and AI Coding | Coffee and AI Coding | Office Hours | Weekly meetup | 10 | limited | [`coffee-and-ai-coding-pczndl`](https://f3insights.com/events/coffee-and-ai-coding-pczndl) |

### December 2026

| Date | Time | Title | Series | Format | EU category | Seats | Status | F3i slug |
|---|---|---|---|---|---|---|---|---|
| Thu Dec 3, 2026 | 4:30-5:00 PM PST | Task and Project Visibility | Standalone | Workshop | Finance | 10 | limited | [`task-and-project-visibility-6tqfmg`](https://f3insights.com/events/task-and-project-visibility-6tqfmg) |
| Sat Dec 5, 2026 | 8:30-10:00 AM PST | Coffee and AI Coding | Coffee and AI Coding | Office Hours | Weekly meetup | 10 | limited | [`coffee-and-ai-coding-6uewuf`](https://f3insights.com/events/coffee-and-ai-coding-6uewuf) |
| Wed Dec 9, 2026 | 1:00-2:00 PM PST | One Idea, Every Format: Production Without the Resizing | Craft First | Webinar | Creative | 30 | open | [`one-idea-every-format-production-without-the-resizing-l9m66z`](https://f3insights.com/events/one-idea-every-format-production-without-the-resizing-l9m66z) |
| Sat Dec 12, 2026 | 8:30-10:00 AM PST | Coffee and AI Coding | Coffee and AI Coding | Office Hours | Weekly meetup | 10 | limited | [`coffee-and-ai-coding-cd96fu`](https://f3insights.com/events/coffee-and-ai-coding-cd96fu) |
| Wed Dec 16, 2026 | 9:00-9:30 AM PST | AI for Email Drafting | Standalone | Workshop | Finance | 10 | limited | [`ai-for-email-drafting-aelqaa`](https://f3insights.com/events/ai-for-email-drafting-aelqaa) |
| Sat Dec 19, 2026 | 8:30-10:00 AM PST | Coffee and AI Coding | Coffee and AI Coding | Office Hours | Weekly meetup | 10 | limited | [`coffee-and-ai-coding-xannqu`](https://f3insights.com/events/coffee-and-ai-coding-xannqu) |
| Sat Dec 26, 2026 | 8:30-10:00 AM PST | Coffee and AI Coding | Coffee and AI Coding | Office Hours | Weekly meetup | 10 | limited | [`coffee-and-ai-coding-wdg4jt`](https://f3insights.com/events/coffee-and-ai-coding-wdg4jt) |

### January 2027

| Date | Time | Title | Series | Format | EU category | Seats | Status | F3i slug |
|---|---|---|---|---|---|---|---|---|
| Wed Jan 6, 2027 | 1:00-2:00 PM PST | Video Without the Editing Bay | Craft First | Webinar | Creative | 30 | open | [`video-without-the-editing-bay-v2g060`](https://f3insights.com/events/video-without-the-editing-bay-v2g060) |
| Thu Jan 7, 2027 | 4:30-5:00 PM PST | Orchestrating Agents for Daily Work | Standalone | Workshop | Productivity | 10 | limited | [`orchestrating-agents-for-daily-work-pvcjar`](https://f3insights.com/events/orchestrating-agents-for-daily-work-pvcjar) |
| Mon Jan 11, 2027 | 9:00-10:30 AM PST | Q1 2027 Cohort: AI for Business Executives, | Q1 2027 Cohort | Workshop | Productivity | 30 | limited | [`q1-2027-cohort-ai-for-business-executives-3m265b`](https://f3insights.com/events/q1-2027-cohort-ai-for-business-executives-3m265b) |
| Fri Jan 15, 2027 | 1:00-2:30 PM PST | Q1 Cohort: Office Hours | Q1 2027 Cohort office hours | Office Hours | Weekly meetup | 30 | limited | [`q1-cohort-office-hours-im9f3p`](https://f3insights.com/events/q1-cohort-office-hours-im9f3p) |
| Mon Jan 18, 2027 | 9:00-10:30 AM PST | Q1 2027 Cohort: AI for Business Executives | Q1 2027 Cohort | Workshop | Finance | 30 | limited | [`q1-2027-cohort-ai-for-business-executives-vhfee8`](https://f3insights.com/events/q1-2027-cohort-ai-for-business-executives-vhfee8) |
| Thu Jan 21, 2027 | 4:30-5:00 PM PST | AI and Excel for Forecasting | Standalone | Workshop | Finance | 10 | limited | [`ai-and-excel-for-forecasting-ftar2m`](https://f3insights.com/events/ai-and-excel-for-forecasting-ftar2m) |
| Fri Jan 22, 2027 | 1:00-2:30 PM PST | Q1 Cohort: Office Hours | Q1 2027 Cohort office hours | Office Hours | Weekly meetup | 30 | limited | [`q1-cohort-office-hours-k4jdmc`](https://f3insights.com/events/q1-cohort-office-hours-k4jdmc) |
| Mon Jan 25, 2027 | 9:00-10:30 AM PST | Q1 2027 Cohort: AI for Business Executives | Q1 2027 Cohort | Workshop | Finance | 30 | limited | [`q1-2027-cohort-ai-for-business-executives-vjr81m`](https://f3insights.com/events/q1-2027-cohort-ai-for-business-executives-vjr81m) |
| Wed Jan 27, 2027 | 1:00-2:00 PM PST | Distribution Without the Copy-Paste | Craft First | Webinar | Creative | 30 | open | [`distribution-without-the-copy-paste-q4xahd`](https://f3insights.com/events/distribution-without-the-copy-paste-q4xahd) |
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
| Wed Feb 17, 2027 | 1:00-2:00 PM PST | Keeping It Yours: Light Quality Checks for a Small Team | Craft First | Webinar | Creative | 30 | open | [`keeping-it-yours-light-quality-checks-for-a-small-team-se5i7u`](https://f3insights.com/events/keeping-it-yours-light-quality-checks-for-a-small-team-se5i7u) |
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
| 1 | `where-the-hours-go-mapping-your-content-pipeline-lbfqvd` | `2026-11-19T10:00:00-08:00` | `2026-11-18T13:00:00-08:00` | **No** | Creative |
| 2 | `one-idea-every-format-production-without-the-resizing-l9m66z` | `2026-12-10T10:00:00-08:00` | `2026-12-09T13:00:00-08:00` | **No** | Creative |
| 3 | `video-without-the-editing-bay-v2g060` | `2027-01-07T10:00:00-08:00` | `2027-01-06T13:00:00-08:00` | **No** | Creative |
| 4 | `distribution-without-the-copy-paste-q4xahd` | `2027-01-28T10:00:00-08:00` | `2027-01-27T13:00:00-08:00` | **No** | Creative |
| 5 | `keeping-it-yours-light-quality-checks-for-a-small-team-se5i7u` | `2027-02-18T10:00:00-08:00` | `2027-02-17T13:00:00-08:00` | **No** | Creative |
