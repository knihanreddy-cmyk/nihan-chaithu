import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-session";
import { isAuthConfigured } from "@/lib/auth";
import { getContent } from "@/lib/cms/content";
import type { Img } from "@/lib/cms/fields";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign in — Portfolio CMS", robots: { index: false } };

function Plate({ img, label, shape, tall }: { img: Img; label: string; shape: string; tall?: boolean }) {
  return (
    <figure className="m-0">
      <Image
        src={img.src}
        width={img.width}
        height={img.height}
        alt={img.alt}
        sizes="(max-width: 1024px) 30vw, 220px"
        className={`block w-full object-cover ${shape} ${tall ? "h-[min(500px,52svh)]" : "h-[min(420px,44svh)]"}`}
        style={{ objectPosition: img.position || "50% 22%" }}
        preload
      />
      <figcaption className="mt-2 text-[11px] font-semibold tracking-[0.14em] text-[#6B635A]">{label}</figcaption>
    </figure>
  );
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { next } = await searchParams;
  // The triptych follows the CMS, so it shows whatever photos the pages use.
  const [chaithrika, nihan] = await Promise.all([getContent("chaithrika"), getContent("nihan")]);
  const plates = [
    { img: chaithrika.about.image, label: "I · STUDIO", shape: "rounded-t-[200px] rounded-b-md" },
    { img: chaithrika.scenes.scene1.image, label: "II · RUNWAY", shape: "rounded-md", tall: true },
    { img: nihan.looks.items[1]?.image ?? nihan.hero.image, label: "III · NIHAN", shape: "rounded-t-md rounded-b-[200px]" },
  ];

  return (
    <div className="flex min-h-svh flex-col px-4 pb-10 pt-7 sm:px-8 lg:px-14">
      <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#1E1B18] pb-4">
        <Link href="/" className="font-fraunces text-[26px] tracking-tight">
          Chaithrika <i className="text-[#9C3F5C]">&amp;</i> Nihan
        </Link>
        <span className="hidden text-xs font-semibold tracking-[0.2em] md:inline">THE FAMILY PORTFOLIO · STUDIO EDITION</span>
        <Link href="/" className="text-[13px] font-medium text-[#9C3F5C] hover:text-[#6E2440]">
          Back to the website →
        </Link>
      </header>

      <div className="flex flex-1 flex-wrap items-center gap-10 pt-10 lg:gap-24">
        <div aria-hidden="true" className="hidden flex-[1_1_460px] grid-cols-3 items-end gap-3 md:grid">
          {plates.map((p) => (
            <Plate key={p.label} {...p} />
          ))}
        </div>

        <div className="mx-auto w-full max-w-105 flex-[1_1_360px]">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#9C3F5C]">EDITOR&apos;S DESK</p>
          <h1 className="mt-3.5 font-fraunces text-[56px] font-light leading-[.98] tracking-tight sm:text-[64px]">
            Welcome <i className="font-light text-[#9C3F5C]">back</i>.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#5A534B]">
            Sign in to edit the pages, the photographs and this season&apos;s booking enquiries.
          </p>

          {!isAuthConfigured() && (
            <p className="mt-5 rounded-[14px] border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              Set <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD</code> and <code>ADMIN_SECRET</code> in{" "}
              <code>.env</code>, then restart the server.
            </p>
          )}

          <LoginForm next={next ?? "/admin"} />
          <p className="mt-6 text-xs text-[#6B635A]">Private to Chaithrika and Nihan&apos;s parents.</p>
        </div>
      </div>
    </div>
  );
}
