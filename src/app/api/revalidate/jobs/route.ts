import { timingSafeEqual } from "node:crypto";
import { revalidateTag, revalidatePath } from "next/cache";
import { JOBS_CACHE_TAG } from "@/lib/public-cache";

export async function POST(request: Request) {
  const secret = process.env.PUBLIC_CACHE_REVALIDATION_SECRET;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  if (!secret) return Response.json({ message: "Revalidation is not configured." }, { status: 503 });
  if (Buffer.byteLength(supplied) !== Buffer.byteLength(secret) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(secret))) return Response.json({ message: "Unauthorized" }, { status: 401 });
  revalidateTag(JOBS_CACHE_TAG, { expire: 0 });
  revalidatePath("/");
  revalidatePath("/foreign-job-vacancies", "layout");
  console.info(JSON.stringify({ event: "public_jobs_invalidated" }));
  return Response.json({ revalidated: true });
}
