import Link from "next/link";
import { signOut } from "@/app/actions";

export default function AccessDeniedPage() {
  return (
    <main className="setup-page">
      <section className="setup-card">
        <p className="eyebrow">Access restricted</p>
        <h1>Your account cannot access this page</h1>
        <p>Ask an administrator to check your staff role.</p>
        <Link href="/">Back to dashboard</Link>
        <form action={signOut}><button className="primary-button" type="submit">Sign out</button></form>
      </section>
    </main>
  );
}
