// Local SVGs from FlagCDN. Keep in sync with the dashboard country suggestions.
const countryCodes: Record<string, string> = {
  "saudi arabia": "sa", ksa: "sa", sa: "sa",
  "united arab emirates": "ae", uae: "ae", ae: "ae",
  qatar: "qa", qa: "qa", kuwait: "kw", kw: "kw",
  bahrain: "bh", bh: "bh", oman: "om", om: "om",
  turkey: "tr", turkiye: "tr", tr: "tr",
  israel: "il", il: "il", malaysia: "my", my: "my",
  singapore: "sg", sg: "sg", maldives: "mv", mv: "mv",
  ireland: "ie", ie: "ie", korea: "kr",
  japan: "jp", jp: "jp", "south korea": "kr", "republic of korea": "kr", kr: "kr",
  romania: "ro", ro: "ro", poland: "pl", pl: "pl", cyprus: "cy", cy: "cy",
};

export function countryFlagPath(country: string | undefined): string | null {
  const normalized = (country || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/\./g, "").trim().replace(/\s+/g, " ");
  const code = countryCodes[normalized];
  return code ? `/assets/flags/${code}.svg` : null;
}
