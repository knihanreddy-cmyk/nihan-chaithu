import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-session";
import { isAuthConfigured } from "@/lib/auth";
import { getContent } from "@/lib/cms/content";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in — Portfolio CMS", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { next } = await searchParams;
  // Use the same two portal photos as the homepage, so the login follows whatever the CMS shows.
  const home = await getContent("home");
  const photos = [home.chaithrika.image, home.nihan.image];

  return (
    <div className="admin relative min-h-svh overflow-hidden bg-[#F3EFF4] font-inter text-[#2A1B2E]">
      {/* Soft colour field, echoing the homepage */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#F4B6C8] opacity-60 blur-[110px]" />
        <div className="absolute -bottom-48 right-[-10rem] h-[38rem] w-[38rem] rounded-full bg-[#A9D8D0] opacity-50 blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[#F7D9A8] opacity-40 blur-[100px]" />
      </div>

      <div className="relative mx-auto grid min-h-svh max-w-6xl items-center gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* Photo panel */}
        <section aria-hidden="true" className="relative hidden h-[min(640px,80svh)] lg:block">
          <div className="absolute left-0 top-6 h-[78%] w-[58%] -rotate-3 overflow-hidden rounded-[28px] shadow-[0_30px_80px_-30px_rgba(42,27,46,.45)] ring-1 ring-white/60">
            <Image
              src={photos[0].src}
              width={photos[0].width}
              height={photos[0].height}
              alt=""
              sizes="360px"
              className="h-full w-full object-cover"
              style={photos[0].position ? { objectPosition: photos[0].position } : undefined}
              preload
            />
          </div>
          <div className="absolute bottom-0 right-0 h-[66%] w-[50%] rotate-[4deg] overflow-hidden rounded-[28px] shadow-[0_30px_80px_-30px_rgba(42,27,46,.45)] ring-1 ring-white/60">
            <Image
              src={photos[1].src}
              width={photos[1].width}
              height={photos[1].height}
              alt=""
              sizes="320px"
              className="h-full w-full object-cover"
              style={{ objectPosition: photos[1].position || "30% 40%" }}
            />
          </div>
          <div className="absolute bottom-16 left-6 rounded-full border border-white/70 bg-white/55 px-4 py-2 text-xs font-medium tracking-wide shadow-sm backdrop-blur-md">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#D9577F] align-middle" />
            Two portfolios, one family
          </div>
        </section>

        {/* Form card */}
        <section className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="font-playfair text-2xl tracking-tight text-[#2A1B2E] transition-opacity hover:opacity-70"
          >
            Chaithrika <i className="text-[#D9577F]">&amp;</i> Nihan
          </Link>

          <div className="mt-8 rounded-[28px] border border-white/70 bg-white/60 p-7 shadow-[0_30px_80px_-40px_rgba(42,27,46,.5)] backdrop-blur-xl sm:p-9">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#2A1B2E]/55">Portfolio CMS</p>
            <h1 className="mt-3 font-playfair text-4xl leading-[1.05] sm:text-[2.75rem]">
              Welcome <em className="text-[#D9577F]">back</em>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[#2A1B2E]/65">
              Sign in to update the pages, photos and booking enquiries.
            </p>

            {!isAuthConfigured() && (
              <p className="mt-5 rounded-2xl bg-amber-50/90 p-3 text-sm text-amber-900 ring-1 ring-amber-200">
                Set <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD</code> and <code>ADMIN_SECRET</code> in{" "}
                <code>.env</code>, then restart the server.
              </p>
            )}

            <LoginForm next={next ?? "/admin"} />
          </div>

          <p className="mt-6 text-center text-xs text-[#2A1B2E]/50">
            <Link href="/" className="underline-offset-4 hover:text-[#2A1B2E] hover:underline">
              ← Back to the website
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
