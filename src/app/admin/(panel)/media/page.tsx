import { listMedia } from "../../actions";
import MediaLibrary from "./MediaLibrary";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const items = await listMedia();
  return (
    <div>
      <header className="mb-6">
        <h1 className="font-playfair text-4xl leading-tight">Photos</h1>
        <p className="mt-1 text-sm text-[#2A1B2E]/55">
          Photos are stored in ImageKit. Upload here, then pick them on any page. A photo can only be deleted once no
          page uses it.
        </p>
      </header>
      <MediaLibrary initial={items} />
    </div>
  );
}
