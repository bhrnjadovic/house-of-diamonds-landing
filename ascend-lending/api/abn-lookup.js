// api/abn-lookup.js — Vercel serverless function
// Proxies business-name search to the Australian Business Register (ABR)
// ABN Lookup web service, so the landing page's "Registered Business Name"
// field can offer a real autocomplete dropdown of matching ABNs.
//
// Setup required before this returns real results:
//   1. Register for a free GUID at https://abr.business.gov.au/Tools/WebServices
//      (self-service, arrives by email immediately — no cost).
//   2. Set it as an environment variable in Vercel: ABR_GUID
//   3. This calls ABR's public JSON name-search endpoint
//      (abr.business.gov.au/json/MatchingNames.aspx) — verify the exact
//      query params and response shape against ABR's current documentation
//      once you have a GUID, since this was built from spec rather than a
//      live-tested call. Adjust the `normalise()` mapping below if the
//      field names in ABR's response differ from what's assumed here.
//
// Until ABR_GUID is set, this endpoint returns an empty result set (so the
// front-end dropdown just shows "no matches" and the user can still type
// their business name in manually — the form never breaks).

const ABR_ENDPOINT = "https://abr.business.gov.au/json/MatchingNames.aspx";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(200).end();

    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const name = (req.query.name || "").toString().trim();
    if (name.length < 3) {
        return res.status(200).json({ results: [] });
    }

    const ABR_GUID = process.env.ABR_GUID;
    if (!ABR_GUID) {
        console.warn("ABR_GUID environment variable is not set — ABN lookup returning no results. Register free at https://abr.business.gov.au/Tools/WebServices");
        return res.status(200).json({ results: [] });
    }

    const url = `${ABR_ENDPOINT}?name=${encodeURIComponent(name)}&maxResults=8&guid=${encodeURIComponent(ABR_GUID)}`;

    try {
        const abrRes = await fetch(url);
        const rawText = await abrRes.text();

        // ABR's JSON endpoint returns JSONP-style output (sometimes wrapped in
        // a callback() call) even without a callback param requested — strip
        // any wrapper before parsing.
        const jsonText = rawText.trim().replace(/^callback\s*\(/i, "").replace(/\)\s*;?\s*$/, "");
        let data;
        try {
            data = JSON.parse(jsonText);
        } catch (parseErr) {
            console.error("ABN Lookup: could not parse ABR response", parseErr.message, rawText.slice(0, 200));
            return res.status(200).json({ results: [] });
        }

        const rawNames = data.Names || data.names || [];
        const results = rawNames.map(n => ({
            abn: n.Abn || n.abn || "",
            name: n.Name || n.name || n.OrganisationName || "",
            state: n.State || n.state || "",
            postcode: n.Postcode || n.postcode || "",
        })).filter(r => r.abn && r.name);

        return res.status(200).json({ results });
    } catch (err) {
        console.error("ABN Lookup request failed:", err.message);
        return res.status(200).json({ results: [] });
    }
}
