"use client";

import { useState } from "react";
import { jobGroups, type JobRecord } from "@eimts/database";
import { GlassSelect } from "./GlassSelect";

export function JobCategoryFields({ job }: { job?: JobRecord }) {
  const [primary, setPrimary] = useState(job?.primary_category ?? "");
  const [selected, setSelected] = useState(job?.subcategories ?? []);
  const group = jobGroups.find(({ title }) => title === primary);

  return <>
    <label>
      Primary category *
      <GlassSelect
        name="primary_category"
        ariaLabel="Primary category"
        placeholder="Select a primary category"
        defaultValue={primary}
        options={jobGroups.map(({ title }) => title)}
        required
        onValueChange={value => {
          if (value !== primary) {
            setPrimary(value);
            setSelected([]);
          }
        }}
      />
      {job && !job.primary_category && <small>Previous category: {job.category}</small>}
    </label>
    {group && <fieldset className="full job-subcategories">
      <legend>Subcategories (choose at least one)</legend>
      {group.links.map((value, index) => <label key={value}>
        <input type="checkbox" name="subcategories" value={value}
          checked={selected.includes(value)} required={index === 0 && selected.length === 0}
          onChange={event => setSelected(event.target.checked ? [...selected, value] : selected.filter(item => item !== value))} />
        {value}
      </label>)}
    </fieldset>}
  </>;
}
