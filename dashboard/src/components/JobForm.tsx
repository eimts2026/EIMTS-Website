import type { JobRecord } from "@eimts/database";
import { toColomboDateInput } from "@/lib/dates";
import { GlassSelect } from "./GlassSelect";
import { ImageDropzone } from "./ImageDropzone";
import { SubmitButton } from "./SubmitButton";
import { Toggle } from "./Toggle";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  job?: JobRecord;
};

const countrySuggestions = [
  "Saudi Arabia",
  "United Arab Emirates",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "Turkey",
  "Israel",
  "Malaysia",
  "Singapore",
  "Maldives",
  "Japan",
  "South Korea",
  "Korea",
  "Ireland",
  "Romania",
  "Poland",
  "Cyprus",
];

const categorySuggestions = [
  "Construction",
  "Welding",
  "Electrical",
  "Plumbing",
  "Engineering",
  "Manufacturing",
  "Hospitality",
  "Housekeeping & Cleaning",
  "Healthcare",
  "Caregiving",
  "Driving & Logistics",
  "Security",
  "Garment & Factory",
  "Agriculture",
  "Domestic Work",
];

const currencies = ["LKR", "USD", "AED", "SAR", "QAR", "KWD", "BHD", "OMR", "TRY", "MYR", "SGD", "KRW", "EUR", "GBP"];

export function JobForm({ action, job }: Props) {
  return (
    <form className="editor-form" action={action}>
      <section className="form-section">
        <div>
          <p className="eyebrow">Vacancy details</p>
          <h2>What candidates will see</h2>
          <p className="form-hint">
            Only the fields marked required are needed to save a draft. You can
            always come back and finish later.
          </p>
        </div>
        <div className="form-grid">
          <label className="full">
            Job title *
            <input
              name="title"
              defaultValue={job?.title}
              placeholder="e.g. Welders for Turkey"
              required
            />
          </label>
          <label>
            Country *
            <GlassSelect name="country" ariaLabel="country" defaultValue={job?.country} options={countrySuggestions} placeholder="Search or enter country" required allowCustom />
          </label>
          <label>
            City or site (optional)
            <input
              name="location"
              defaultValue={job?.location || ""}
              placeholder="e.g. Istanbul"
            />
          </label>
          <label>
            Category *
            <GlassSelect name="category" ariaLabel="category" defaultValue={job?.category} options={categorySuggestions} placeholder="Search or enter category" required allowCustom />
          </label>
          <label>
            Employment type
            <GlassSelect
              name="employment_type"
              ariaLabel="Employment type"
              defaultValue={job?.employment_type || "Full-time"}
              options={["Full-time", "Part-time", "Contract", "Temporary"]}
            />
          </label>
          <label>
            Salary amount
            <input
              name="salary_amount"
              type="number"
              min="0"
              step="0.01"
              defaultValue={job?.salary_amount ?? job?.salary_min ?? job?.salary_max ?? ""}
              placeholder="e.g. 199080"
            />
          </label>
          <label>
            LKR equivalent (optional)
            <input
              name="salary_lkr"
              type="number"
              min="0"
              step="0.01"
              defaultValue={job?.salary_lkr ?? ""}
              placeholder="e.g. 385678"
            />
          </label>
          <label>
            Currency
            <GlassSelect
              name="currency"
              ariaLabel="Currency"
              defaultValue={job?.currency || "LKR"}
              options={currencies}
            />
          </label>
          <label>
            Closing date
            <input
              name="expires_at"
              type="date"
              defaultValue={toColomboDateInput(job?.expires_at)}
            />
          </label>
          <label className="full">
            Short summary *
            <textarea
              name="summary"
              rows={3}
              defaultValue={job?.summary}
              placeholder="One or two sentences shown on the vacancy card."
              required
            />
          </label>
          <label className="full">
            Full description *
            <textarea
              name="description"
              rows={10}
              defaultValue={job?.description}
              placeholder="The complete job description shown on the job page."
              required
            />
          </label>
          <label className="full">
            Requirements
            <textarea
              name="requirements"
              rows={6}
              defaultValue={job?.requirements.join("\n")}
              placeholder={"Add one requirement per line, for example:\nExperience in similar capacity\nAge 21 to 45\nValid passport"}
            />
          </label>
          <ImageDropzone defaultUrl={job?.image_url} />
          <details className="full advanced-options">
            <summary>Advanced: web address (URL slug)</summary>
            <label className="full">
              URL slug
              <input
                name="slug"
                defaultValue={job?.slug}
                placeholder="Created automatically from the title"
              />
              <small className="field-help">
                Leave this empty and it is created from the title. Avoid
                changing it after publishing so shared links keep working.
              </small>
            </label>
          </details>
        </div>
      </section>
      <aside className="publish-panel">
        <h2>Publishing</h2>
        <label>
          Status
          <GlassSelect
            name="status"
            ariaLabel="Status"
            defaultValue={job?.status || "draft"}
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "paused", label: "Paused" },
              { value: "expired", label: "Expired" },
            ]}
          />
        </label>
        <Toggle
          name="urgent"
          label="Mark as urgent"
          hint="Shows an urgent badge and includes published, unexpired jobs in the homepage urgent list."
          defaultChecked={job?.urgent}
        />
        <Toggle
          name="featured"
          label="Feature on homepage"
          hint="Legacy featured flag. Use Mark as urgent to include this vacancy in the homepage urgent list."
          defaultChecked={job?.featured}
        />
        <SubmitButton label={job ? "Save changes" : "Create vacancy"} />
        <p className="panel-hint">
          Save as a draft first, then publish when the details are approved.
        </p>
      </aside>
    </form>
  );
}
