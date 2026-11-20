import { collections, isDbConfigured } from "@/lib/db";
import { deleteEnquiry, setEnquiryRead } from "../../actions";
import ConfirmButton from "./ConfirmButton";

export const dynamic = "force-dynamic";

const fmt = (d: Date) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(d);

export default async function EnquiriesPage() {
  const list = isDbConfigured()
    ? await (await collections()).enquiries.find().sort({ createdAt: -1 }).limit(500).toArray()
    : [];

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Enquiries</h1>
        <p className="mt-1 text-sm text-stone-500">Messages sent from the booking forms on Chaithrika&apos;s and Nihan&apos;s pages.</p>
      </header>

      {list.length === 0 ? (
        <p className="rounded-xl bg-white p-8 text-center text-sm text-stone-500 ring-1 ring-stone-200">No enquiries yet.</p>
      ) : (
        <ul className="space-y-3">
          {list.map((e) => {
            const id = e._id.toString();
            const contact = e.contact.trim();
            const href = contact.includes("@")
              ? `mailto:${contact}`
              : /^[+\d][\d\s()-]{5,}$/.test(contact)
                ? `tel:${contact.replace(/[^\d+]/g, "")}`
                : null;
            return (
              <li key={id} className={`rounded-xl bg-white p-5 ${e.read ? "ring-1 ring-stone-200" : "ring-2 ring-stone-900"}`}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {!e.read && <span className="rounded-full bg-stone-900 px-2 py-0.5 text-[11px] font-semibold text-white">New</span>}
                  <span className="font-semibold">{e.name}</span>
                  {e.company && <span className="text-sm text-stone-500">{e.company}</span>}
                  <span className="ml-auto text-xs text-stone-500">
                    {e.page === "nihan" ? "Nihan" : "Chaithrika"} · {fmt(e.createdAt)}
                  </span>
                </div>
                {contact && (
                  <p className="mt-1 text-sm">
                    {href ? (
                      <a className="underline underline-offset-2" href={href}>
                        {contact}
                      </a>
                    ) : (
                      contact
                    )}
                  </p>
                )}
                {e.type && <p className="mt-1 text-xs font-medium uppercase tracking-wider text-stone-500">{e.type}</p>}
                {e.message && <p className="mt-3 whitespace-pre-wrap text-sm text-stone-800">{e.message}</p>}
                <div className="mt-4 flex gap-4 text-sm">
                  <form action={setEnquiryRead.bind(null, id, !e.read)}>
                    <button type="submit" className="text-stone-600 hover:text-stone-900">
                      Mark as {e.read ? "unread" : "read"}
                    </button>
                  </form>
                  <form action={deleteEnquiry.bind(null, id)}>
                    <ConfirmButton message={`Delete the enquiry from ${e.name}?`}>Delete</ConfirmButton>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
