import Link from "next/link";
import { signOut } from "@/app/actions";
import { NavLinks } from "./NavLinks";
import { RealtimeStatus } from "./RealtimeStatus";
import { ThemeToggle } from "./ThemeToggle";

export function DashboardHeader({ email }: { email: string }) {
  return (
    <header className="dashboard-header">
      <Link className="dashboard-brand" href="/">
        <span
          className="dashboard-brand-logo"
          role="img"
          aria-label="Emerald Isle Manpower"
        />
        <small>Content desk</small>
      </Link>
      <NavLinks />
      <div className="dashboard-header-actions">
        <RealtimeStatus />
        <form action={signOut}>
          <span>{email}</span>
          <ThemeToggle />
          <button className="ghost-button" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
