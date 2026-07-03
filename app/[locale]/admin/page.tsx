import { notFound } from "next/navigation";
import Link from "next/link";
import { isLocale, dictionary } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { classes, events } from "@/lib/content";
import { googleSheetsSchema } from "@/lib/schema";
import { AdminDashboard } from "@/components/admin-dashboard";

export default async function AdminPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const copy = dictionary[rawLocale];
  const classLabels = Object.fromEntries(
    classes.map((item) => [item.id, `${t(item.title, rawLocale)} - ${item.ageGroup}`])
  );
  const eventLabels = Object.fromEntries(
    events.map((item) => [item.id, `${t(item.title, rawLocale)} - ${item.date}`])
  );

  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href={`/${rawLocale}`} className="font-serif text-xl font-semibold">
            Elsa Dance School
          </Link>
          <Link href={`/${rawLocale}`} className="text-sm font-semibold text-jade">
            {copy.nav.home}
          </Link>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-serif text-4xl font-bold">{copy.adminTitle}</h1>
        <p className="mt-3 max-w-3xl text-black/70">
          Local staff workflow for reservations and the Google Sheets-ready content model.
        </p>
        <AdminDashboard
          copy={copy}
          schema={googleSheetsSchema}
          classLabels={classLabels}
          eventLabels={eventLabels}
        />
      </section>
    </main>
  );
}
