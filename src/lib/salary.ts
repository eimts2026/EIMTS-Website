type Salary = {
  salary_amount: number | null;
  salary_lkr: number | null;
  currency: string;
};

export function formatJobSalary(job: Salary): string | null {
  const amount = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });
  const primary = job.salary_amount;
  if (primary == null) return null;
  const base = `${job.currency} ${amount.format(primary)}`;
  return job.currency !== "LKR" && job.salary_lkr != null
    ? `${base} / LKR ${amount.format(job.salary_lkr)}` : base;
}
