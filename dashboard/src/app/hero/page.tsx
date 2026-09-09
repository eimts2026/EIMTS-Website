import { SubmitButton } from "@/components/SubmitButton";
import { requireRouteAccess } from "@/lib/require-route-access";
import Link from "next/link";
import type { HeroSlideRecord } from "@eimts/database";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SetupRequired } from "@/components/SetupRequired";
import {
  deleteHeroSlide,
  moveHeroSlide,
  setHeroSlideActive,
} from "@/app/actions";
import { toColomboDateInput } from "@/lib/dates";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function slideState(slide: HeroSlideRecord) {
  if (!slide.active) return "inactive";
  const now = Date.now();
  if (slide.starts_at && new Date(slide.starts_at).getTime() > now) {
    return "scheduled";
  }
  if (slide.ends_at && new Date(slide.ends_at).getTime() < now) {
    return "ended";
  }
  return "live";
}

const stateLabels: Record<string, string> = {
  live: "Live",
  scheduled: "Scheduled",
  ended: "Ended",
  inactive: "Inactive",
};

export default async function HeroSlidesPage() {
  if (!isSupabaseConfigured()) return <SetupRequired />;
  const supabase = await createClient();
  if (!supabase) return <SetupRequired />;
  await requireRouteAccess("/hero");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = profile?.role || "viewer";

  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  const slides = (data || []) as HeroSlideRecord[];
  const liveTakeover = slides.find(
    (slide) => slide.is_takeover && slideState(slide) === "live",
  );
  // The arrows move a slide within the rotation, skipping takeover rows, so
  // first/last must be judged against rotation slides only.
  const rotationIds = slides
    .filter((slide) => !slide.is_takeover)
    .map((slide) => slide.id);

  return (
    <div className="dashboard-shell">
      <DashboardHeader email={user.email || "Staff"} />
      <main className="dashboard-main">
        <section className="dashboard-title">
          <div>
            <p className="eyebrow">Homepage</p>
            <h1>Hero slides</h1>
            <p>
              Manage the rotating banner at the top of the homepage, or take it
              over with an occasion post.
            </p>
          </div>
          {role !== "viewer" && (
            <Link className="primary-button" href="/hero/new">
              Add slide
            </Link>
          )}
        </section>

        <section className="jobs-table-card">
          <div className="table-heading">
            <h2>All slides</h2>
            <span>
              {liveTakeover
                ? `Takeover live: ${liveTakeover.title}`
                : `${slides.filter((slide) => slideState(slide) === "live").length} in rotation now`}
            </span>
          </div>
          {error ? (
            <div className="empty-state">
              <h3>The hero_slides table is missing</h3>
              <p>
                Run the migration supabase/migrations/202608040001_hero_slides.sql
                against the Supabase project, then reload this page.
              </p>
            </div>
          ) : slides.length ? (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Slide</th>
                    <th>Order</th>
                    <th>Schedule</th>
                    <th>Status</th>
                    <th>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {slides.map((slide) => {
                    const state = slideState(slide);
                    const rotationIndex = rotationIds.indexOf(slide.id);
                    return (
                      <tr key={slide.id}>
                        <td>
                          <strong>{slide.title}</strong>
                          <small>
                            {slide.is_takeover
                              ? "Occasion takeover"
                              : slide.kicker || "Rotation slide"}
                          </small>
                        </td>
                        <td className="row-actions">
                          {role !== "viewer" && !slide.is_takeover ? (
                            <>
                              <form
                                action={moveHeroSlide.bind(null, slide.id, "up")}
                              >
                                <SubmitButton disabled={rotationIndex <= 0} className="" label="↑" pendingLabel="Moving…" aria-label="Move slide earlier" />
                              </form>
                              <form
                                action={moveHeroSlide.bind(
                                  null,
                                  slide.id,
                                  "down",
                                )}
                              >
                                <SubmitButton className="" label="↓" pendingLabel="Moving…" disabled={rotationIndex === rotationIds.length - 1} aria-label="Move slide later" />
                              </form>
                            </>
                          ) : (
                            <span>—</span>
                          )}
                        </td>
                        <td>
                          {slide.starts_at || slide.ends_at
                            ? `${toColomboDateInput(slide.starts_at) || "Now"} → ${toColomboDateInput(slide.ends_at) || "No end"}`
                            : "Always"}
                        </td>
                        <td>
                          <span className={`status status-popup-${state}`}>
                            {stateLabels[state]}
                          </span>
                        </td>
                        <td className="row-actions">
                          <Link href={`/hero/${slide.id}`}>Edit</Link>
                          {role !== "viewer" && (
                            <form
                              action={setHeroSlideActive.bind(
                                null,
                                slide.id,
                                !slide.active,
                              )}
                            >
                              <SubmitButton className="" label={slide.active ? "Deactivate" : "Activate"} pendingLabel="Updating…" />
                            </form>
                          )}
                          {role === "admin" && (
                            <form action={deleteHeroSlide.bind(null, slide.id)}>
                              <SubmitButton className="danger-button" label="Delete" pendingLabel="Deleting…" />
                            </form>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <h3>No hero slides yet</h3>
              <p>
                Add a slide to control the homepage banner from here. Until one
                is live, the website shows its built-in slides.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
