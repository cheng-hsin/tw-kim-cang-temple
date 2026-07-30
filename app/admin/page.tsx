import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, verifySessionToken } from "../lib/session";
import { IMAGE_SLOTS, resolveSlotImage } from "../lib/imageSlots";
import { listEbooks } from "../lib/ebooks";
import AdminDashboard from "./AdminDashboard";
import EbooksAdmin from "./EbooksAdmin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    redirect("/admin/login");
  }

  const slots = IMAGE_SLOTS.map((slot) => ({
    ...slot,
    src: resolveSlotImage(slot.key),
  }));
  const ebooks = listEbooks();

  return (
    <>
      <AdminDashboard slots={slots} />
      <div className="mx-auto max-w-4xl px-6 pb-16">
        <EbooksAdmin ebooks={ebooks} />
      </div>
    </>
  );
}
