import { handleInquiry } from "@/lib/inquiry-handler";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: Request) { return handleInquiry(request); }
