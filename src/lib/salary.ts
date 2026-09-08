type Salary = {
  salary_amount: number | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_lkr: number | null;
  currency: string;
};

export function formatJobSalary(job: Salary): string | null {
  const amount = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });
  const primary = job.salary_amount ?? job.salary_min ?? job.salary_max;
  if (primary == null) return null;
  const range = job.salary_amount == null && job.salary_min != null && job.salary_max != null && job.salary_min !== job.salary_max;
  const base = `${job.currency} ${amount.format(primary)}${range ? ` – ${amount.format(job.salary_max!)}` : ""}`;
  return job.currency !== "LKR" && job.salary_lkr != null
    ? `${base} / LKR ${amount.format(job.salary_lkr)}` : base;
}
