# House of Diamonds — Lead Data Schema
**Version:** 1.0
**Date:** 2026-03-17
**Status:** Source of truth for all lead data across ads, landing pages, CRM, email, SMS, and reporting.

---

## 1. Full Lead Schema

| Field | Data Type | Required | Controlled Values |
|---|---|---|---|
| `lead_id` | string (UUID v4) | Yes | Auto-generated |
| `created_at` | string (ISO 8601) | Yes | Auto-set on submission |
| `first_name` | string | Yes | Free text |
| `email` | string (email) | Yes | Free text |
| `phone` | string (E.164) | No | e.g. `+61410744631` |
| `timeline` | enum | No | See controlled values |
| `budget` | enum | No | See controlled values |
| `message` | string | No | Free text |
| `source` | enum | No | See controlled values |
| `landing_page` | enum | No | See controlled values |
| `utm_source` | string | No | Free text (from URL) |
| `utm_medium` | string | No | Free text (from URL) |
| `utm_campaign` | string | No | Free text (from URL) |
| `utm_content` | string | No | Free text (from URL) |
| `utm_term` | string | No | Free text (from URL) |
| `fbclid` | string | No | Auto-captured from URL |
| `status` | enum | Yes | See controlled values |
| `assigned_to` | string | No | Staff name or ID |
| `notes` | string | No | Free text (CRM only) |
| `last_contacted_at` | string (ISO 8601) | No | CRM managed |
| `next_follow_up_at` | string (ISO 8601) | No | CRM managed |
| `consultation_booked` | boolean | No | `true` / `false` |
| `consultation_date` | string (ISO 8601) | No | CRM managed |
| `deal_value_estimate` | integer (AUD) | No | e.g. `4500` |
| `deal_outcome` | enum | No | See controlled values |

---

## 2. Controlled Field Values

### `timeline`
| Value | Display Label (use this exactly in forms) |
|---|---|
| `2_to_6_weeks` | 2–6 weeks |
| `6_to_12_weeks` | 6–12 weeks |
| `3_to_6_months` | 3–6 months+ |
| `just_researching` | Just researching |

> **Form inconsistency to fix:** expert-guide currently uses prefixed values (`Now - 2-6 weeks`, `Soon - 6-12 weeks`, `Later - 3-6 months+`). Both forms must be updated to use the plain display labels above.

### `budget`
| Value | Display Label (use this exactly in forms) |
|---|---|
| `2k_to_4k` | $2k–$4k |
| `4k_to_7k` | $4k–$7k |
| `7k_to_12k` | $7k–$12k |
| `12k_plus` | $12k+ |

> **Form inconsistency to fix:** expert-guide has no budget field. It must be added to match meta-landing.

### `landing_page`
| Value | URL |
|---|---|
| `meta-landing` | /meta-landing or custom-engagement-rings |
| `expert-guide` | /expert-guide or engagement-ring-guide |

### `source`
| Value | When to use |
|---|---|
| `meta_ads` | utm_medium = `paid_social` or fbclid present |
| `google_ads` | utm_medium = `cpc` and utm_source = `google` |
| `organic_search` | utm_medium = `organic` |
| `direct` | No UTM params, no fbclid |
| `referral` | utm_medium = `referral` |
| `email` | utm_medium = `email` |

### `status` (CRM pipeline stages)
| Value | Meaning |
|---|---|
| `new_lead` | Just submitted — not yet contacted |
| `contacted` | First contact attempted |
| `conversation_started` | Two-way exchange underway |
| `consultation_booked` | Appointment scheduled |
| `design_stage` | Active design discussion |
| `quote_sent` | Formal quote provided |
| `won` | Purchase confirmed |
| `lost` | No longer active |

### `deal_outcome`
| Value | Meaning |
|---|---|
| `won` | Ring purchased |
| `lost` | Did not proceed |
| `no_show` | Consultation not attended |
| `cancelled` | Lead cancelled their appointment |

---

## 3. Sample JSON Lead Record

```json
{
  "lead_id": "a3f1c2e4-8d47-4b2a-9f1e-c3d2b1a0e5f6",
  "created_at": "2026-03-17T09:42:00+11:00",
  "first_name": "Sarah",
  "email": "sarah@example.com",
  "phone": "+61412345678",
  "timeline": "2_to_6_weeks",
  "budget": "4k_to_7k",
  "message": "Looking for a round solitaire, natural diamond preferred.",
  "source": "meta_ads",
  "landing_page": "meta-landing",
  "utm_source": "facebook",
  "utm_medium": "paid_social",
  "utm_campaign": "engagement-rings-sydney-mar26",
  "utm_content": "video-ad-01",
  "utm_term": null,
  "fbclid": "IwAR3xxxxxxxxxxxxxxxxxxx",
  "status": "new_lead",
  "assigned_to": "belmir",
  "notes": null,
  "last_contacted_at": null,
  "next_follow_up_at": null,
  "consultation_booked": false,
  "consultation_date": null,
  "deal_value_estimate": null,
  "deal_outcome": null
}
```

---

## 4. What to Capture on Landing Pages Now vs. Later

### Capture on landing pages NOW (form fields + hidden fields)

These fields must be present at the point of submission so no data is lost.

| Field | How to capture |
|---|---|
| `first_name` | Visible form field (already present) |
| `email` | Visible form field (already present) |
| `phone` | Visible form field (already present) |
| `timeline` | Visible dropdown — **needs to be added** |
| `budget` | Visible dropdown — **needs to be added** |
| `message` | Visible textarea (already present) |
| `landing_page` | Hidden field — hardcoded per page (e.g. `meta-landing`) |
| `utm_source` | Hidden field — read from URL on page load |
| `utm_medium` | Hidden field — read from URL on page load |
| `utm_campaign` | Hidden field — read from URL on page load |
| `utm_content` | Hidden field — read from URL on page load |
| `utm_term` | Hidden field — read from URL on page load |
| `fbclid` | Hidden field — read from URL on page load |

### Add later inside the CRM (do not capture on form)

These are set by the system or by the sales person after submission.

| Field | Set by |
|---|---|
| `lead_id` | CRM / backend on record creation |
| `created_at` | CRM / backend on record creation |
| `source` | Derived from UTM fields on ingest |
| `status` | CRM — default `new_lead` on creation |
| `assigned_to` | CRM — manual or auto-assignment rule |
| `notes` | CRM — sales person adds manually |
| `last_contacted_at` | CRM — updated on each contact log |
| `next_follow_up_at` | CRM — set by sales person |
| `consultation_booked` | CRM — updated when Calendly fires webhook |
| `consultation_date` | CRM — populated from Calendly webhook |
| `deal_value_estimate` | CRM — sales person estimates after consultation |
| `deal_outcome` | CRM — set when deal is closed |

---

## 5. Normalisation Rules

- **Phone numbers** must be stored in E.164 format: `+61XXXXXXXXX`. Strip spaces and formatting on ingest.
- **Dates and times** must be ISO 8601 with timezone offset: `2026-03-17T09:42:00+11:00`.
- **Enum fields** must use the exact slug values defined above — never free text, never display labels.
- **`landing_page`** must be set as a hardcoded hidden field on each page — never derived from the URL path, which can change.
- **`source`** must be derived programmatically from UTMs/fbclid on ingest, not entered manually.
- **`lead_id`** must be a UUID v4. Never use sequential integers (privacy and guessability).
- **Null vs. missing** — absent optional fields should be stored as `null`, not omitted, so every record has the same shape.
