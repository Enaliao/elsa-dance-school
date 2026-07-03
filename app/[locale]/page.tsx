import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Medal, Music2, Play, Sparkles, Users } from "lucide-react";
import { classes, events, media, programNames, teachers } from "@/lib/content";
import { dictionary, isLocale, t } from "@/lib/i18n";
import { classAvailability, readInquiries } from "@/lib/storage";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ReservationForm } from "@/components/reservation-form";

const videos = [
  {
    id: "_s0-usDQ8v0",
    title: "Grade 4 dance showcase"
  },
  {
    id: "h5Xgb2cAVwU",
    title: "Adult dance showcase"
  },
  {
    id: "z643-V-Mkww",
    title: "Dance fitness tutorial"
  }
];

export default async function LocalePage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ classId?: string; eventId?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const { classId, eventId } = await searchParams;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const copy = dictionary[locale];
  const inquiries = await readInquiries();
  const availabilityByClass = new Map<string, ReturnType<typeof classAvailability>>();
  for (const inquiry of inquiries) {
    availabilityByClass.set(inquiry.classId, classAvailability(inquiry.classId, inquiries));
  }
  for (const item of classes) {
    if (!availabilityByClass.has(item.id)) {
      availabilityByClass.set(item.id, classAvailability(item.id, inquiries));
    }
  }

  return (
    <main>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href={`/${locale}`} className="font-serif text-xl font-semibold">
            Elsa Dance School
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
            <a href="#classes">{copy.nav.classes}</a>
            <a href="#events">{copy.nav.events}</a>
            <a href="#gallery">{copy.nav.gallery}</a>
            <a href="#about">{copy.nav.about}</a>
            <a href="#partners">{copy.nav.partners}</a>
            <a href="#register">{copy.nav.register}</a>
            <Link href={`/${locale}/admin`}>{copy.nav.admin}</Link>
          </nav>
          <LanguageSwitcher locale={locale} />
        </div>
      </header>

      <section id="home" className="relative min-h-[680px] overflow-hidden bg-ink text-white">
        <Image
          src="/photos/optimized-rehearsal.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/15" />
        <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col justify-center px-4 pb-24 pt-24">
          <p className="mb-4 flex max-w-2xl items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-gold">
            <MapPin size={16} /> {copy.address}
          </p>
          <h1 className="max-w-3xl font-serif text-5xl font-bold leading-tight md:text-7xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-white/90">{copy.heroSubtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#register"
              className="focus-ring inline-flex items-center gap-2 rounded-md bg-vermilion px-5 py-3 font-semibold text-white shadow-soft"
            >
              <Sparkles size={18} /> {copy.reserve}
            </a>
            <a
              href="#classes"
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/35 px-5 py-3 font-semibold text-white"
            >
              <Music2 size={18} /> {copy.viewClasses}
            </a>
          </div>
          <div className="absolute bottom-6 left-4 right-4 mx-auto max-w-7xl border-t border-white/30 pt-5 text-sm font-medium text-white/85">
            {copy.proof}
          </div>
        </div>
      </section>

      <section id="classes" className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-serif text-4xl font-bold">{copy.classesTitle}</h2>
          <div className="hidden items-center gap-2 text-sm text-black/65 sm:flex">
            <Users size={18} /> Kids | Teens | Adults | Private
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((item) => {
            const availability = availabilityByClass.get(item.id) || classAvailability(item.id, inquiries);
            const isFull = availability.available <= 0;
            const displayedReserved = Math.min(availability.reserved, availability.capacity);
            return (
              <article key={item.id} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-vermilion">
                    {t(programNames[item.programId], locale)}
                  </p>
                  <h3 className="mt-1 text-xl font-bold">{t(item.title, locale)}</h3>
                </div>
                <span className="rounded-full bg-jade/10 px-3 py-1 text-xs font-semibold uppercase text-jade">
                  {item.ageGroup}
                </span>
              </div>
              <dl className="grid gap-2 text-sm text-black/75">
                <div className="flex justify-between gap-4">
                  <dt>Level</dt>
                  <dd className="font-semibold">{t(item.level, locale)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Schedule</dt>
                  <dd className="text-right font-semibold">
                    {item.id === "private-coaching" || item.id === "summer-camp-2026" ? (
                      <a
                        href={`/${locale}?classId=${encodeURIComponent(item.id)}#register`}
                        className="focus-ring inline-flex rounded-md text-vermilion underline decoration-vermilion/35 underline-offset-4 hover:decoration-vermilion"
                      >
                        {t(item.schedule, locale)}
                      </a>
                    ) : (
                      t(item.schedule, locale)
                    )}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>{copy.status}</dt>
                  <dd className="text-right">
                    <a
                      href={`/${locale}?classId=${encodeURIComponent(item.id)}#register`}
                      className={`focus-ring inline-flex rounded-md px-3 py-1 text-sm font-semibold ${
                        isFull ? "bg-gold/10 text-gold" : "bg-jade/10 text-jade"
                      }`}
                    >
                      {isFull ? copy.full : copy.unlimited}
                      {` (${displayedReserved}/${availability.capacity} reserved)`}
                    </a>
                  </dd>
                </div>
              </dl>
              </article>
            );
          })}
        </div>
      </section>

      <section id="events" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-serif text-4xl font-bold">{copy.eventsTitle}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {events.map((item) => (
              <article key={item.id} className="rounded-lg border border-black/10 p-5">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1 text-sm font-semibold text-gold">
                  <CalendarDays size={16} /> {item.date}
                </div>
                <h3 className="text-xl font-bold">{t(item.title, locale)}</h3>
                <p className="mt-1 text-sm font-medium text-black/60">{t(item.location, locale)}</p>
                <p className="mt-4 leading-7 text-black/75">{t(item.summary, locale)}</p>
                <a
                  href={`/${locale}?eventId=${encodeURIComponent(item.id)}#register`}
                  className="focus-ring mt-5 inline-flex rounded-md bg-vermilion px-4 py-2 font-semibold text-white"
                >
                  Reserve tickets
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="font-serif text-4xl font-bold">{copy.galleryTitle}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {media.map((item) => (
            <figure key={item.id} className="overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="relative aspect-[4/3]">
                <Image src={item.src} alt={t(item.title, locale)} fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
              </div>
              <figcaption className="p-4 font-semibold">{t(item.title, locale)}</figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
          <div>
            <h3 className="font-serif text-3xl font-bold">Videos</h3>
            <p className="mt-3 leading-7 text-black/70">
              Recent moments from Elsa Dance School.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noreferrer"
                className="focus-ring group overflow-hidden rounded-lg bg-black shadow-sm"
                aria-label={`Watch ${video.title} on YouTube`}
              >
                <div className="relative aspect-video">
                  <Image
                    src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                    alt=""
                    fill
                    className="object-cover opacity-85 transition group-hover:scale-105 group-hover:opacity-100"
                    sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 100vw"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-vermilion shadow-soft transition group-hover:scale-105">
                      <Play fill="currentColor" size={24} />
                    </span>
                  </div>
                </div>
                <div className="bg-white p-4">
                  <p className="font-semibold text-ink">{video.title}</p>
                  <p className="mt-1 text-sm font-medium text-jade">Watch on YouTube</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-ink py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[1fr_0.8fr] md:items-start">
          <div>
            <h2 className="font-serif text-4xl font-bold">{copy.aboutTitle}</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/82">{copy.aboutBody}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {teachers.map((teacher) => (
                <article key={teacher.id} className="rounded-lg border border-white/15 bg-white/7 p-5">
                  <p className="text-sm font-semibold uppercase text-gold">{t(teacher.role, locale)}</p>
                  <h3 className="mt-2 font-serif text-2xl font-bold">{teacher.name}</h3>
                  <p className="mt-3 leading-7 text-white/78">{t(teacher.bio, locale)}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="grid gap-3">
            {["Place des Arts", "Competition teams", "Community partners"].map((item) => (
              <div key={item} className="flex items-center gap-3 border-b border-white/20 py-4 text-lg font-semibold">
                <Medal className="text-gold" /> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="partners" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="font-serif text-4xl font-bold">{copy.partnersTitle}</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-black/75">{copy.partnersBody}</p>
      </section>

      <section id="register" className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="font-serif text-4xl font-bold">{copy.registrationTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-black/75">{copy.registrationBody}</p>
          </div>
          <ReservationForm
            locale={locale}
            classes={classes}
            events={events}
            initialClassId={classId}
            initialEventId={eventId}
            ticketLinks={[
              {
                label: "Book through Elsa Dance School",
                href: "https://www.elsadanceschool.ca/"
              },
              {
                label: "Ask about group tickets",
                href: `/${locale}#partners`
              }
            ]}
          />
        </div>
      </section>

      <footer className="border-t border-black/10 px-4 py-8 text-center text-sm text-black/65">
        Elsa Dance School, {copy.address}
      </footer>
    </main>
  );
}
