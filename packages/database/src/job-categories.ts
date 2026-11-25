export const jobGroups = [
  {
    title: "Hospitality & Healthcare",
    links: [
      "Hotel / Restaurant / Food",
      "Spa / Beauty / Salon",
      "Healthcare",
    ],
  },
  {
    title: "Retail, Admin & Accounts",
    links: [
      "Sales / Marketing / Merchandise",
      "Accounting / Auditing / Finance",
      "Logistic / Warehouse / Transport",
      "Secretary / Admin",
      "HR / Training",
      "Education",
    ],
  },
  {
    title: "Engineering",
    links: [
      "Automotive / Vehicle Maintenance / Service & Repair",
      "Marine / Aviation / Watersports",
      "Engineering / Technical / Skilled Trades",
      "Agricultural / Gardening / Skilled & Unskilled Labour",
      "Security / Safety",
    ],
  },
];

export function readJobCategories(form: FormData) {
  const group = jobGroups.find(({ title }) => title === form.get("primary_category"));
  const values = form.getAll("subcategories");
  if (!group || !values.length || values.some(value => typeof value !== "string" || !group.links.includes(value))) {
    throw new Error("Choose a primary category and at least one of its subcategories.");
  }
  const subcategories = group.links.filter(value => values.includes(value));
  return { category: subcategories[0], subcategories };
}
