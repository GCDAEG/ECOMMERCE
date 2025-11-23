// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function middleware(req: NextRequest) {
  const response = NextResponse.next();
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  const protectedPaths = ["/orders", "/profile", "/auth/sign-up/success"];
  const pathname = req.nextUrl.pathname;

  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    if (!user) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/orders/:path*", "/profile/:path*", "/auth/sign-up/success"],
};
