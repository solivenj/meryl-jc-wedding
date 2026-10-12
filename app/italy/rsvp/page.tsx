import type { Metadata } from "next";
import { Motif } from "@/components/italy/Art";
import { PhotoPanel } from "@/components/italy/PhotoPanel";
import { RsvpReply } from "@/components/italy/RsvpReply";
import { Prose, Rule, ScriptTitle, capsLinkClass } from "@/components/italy/Type";
import { ITALY_RSVP, ITALY_RSVP_PAGE } from "@/lib/italy-content";

export const metadata: Metadata = { title: "RSVP" };

export default function RsvpPage() {
  return (
    <>
      <PhotoPanel
        slot="rsvp"
        gradient="linear-gradient(170deg,#D6D2CA 0%,#8C8880 50%,#26261F 100%)"
        className="flex h-[clamp(320px,46vw,520px)] flex-col items-center justify-center gap-[18px]"
      >
        <h1 className="relative indent-[0.34em] font-caps text-[clamp(22px,3.4vw,38px)] tracking-[0.34em] text-ivory">
          {ITALY_RSVP_PAGE.hero}
        </h1>
        <p className="relative px-4 text-center font-caps text-[10px] uppercase tracking-[0.24em] text-ivory/80">
          {ITALY_RSVP_PAGE.heroSub}
        </p>
      </PhotoPanel>

      <div className="flex flex-col items-center gap-[26px] px-4 pt-[86px] pb-[30px] text-center">
        <ScriptTitle>{ITALY_RSVP_PAGE.replyTitle}</ScriptTitle>
        <Prose>{ITALY_RSVP_PAGE.replyBody}</Prose>
        <div className="flex flex-wrap items-center justify-center gap-x-[34px] gap-y-5">
          <RsvpReply label={ITALY_RSVP_PAGE.replyButton} />
          <a href={`mailto:${ITALY_RSVP.mailtoFallback}`} className={capsLinkClass}>
            {ITALY_RSVP_PAGE.emailLink}
          </a>
        </div>

        <Rule className="my-[22px]" />

        <ScriptTitle>{ITALY_RSVP_PAGE.registryTitle}</ScriptTitle>
        <Motif name="rings" size={112} className="text-ink" />
        <Prose>{ITALY_RSVP_PAGE.registryBody}</Prose>
        {ITALY_RSVP_PAGE.registryLinks.length > 0 && (
          <>
            <Rule />
            <div className="flex flex-wrap justify-center gap-[34px]">
              {ITALY_RSVP_PAGE.registryLinks.map((l) => (
                <a key={l.href} href={l.href} className={capsLinkClass}>
                  {l.label}
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
