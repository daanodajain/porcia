"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Card, Container, MediaAsset } from "@/components/ui";
import { type WordPressCard } from "@/lib/wordpress";

interface WordPressPageProps {
  page: WordPressCard;
  pageLabel: string;
}

export function WordPressPageView({ page, pageLabel }: WordPressPageProps) {
  return (
    <div className="bg-[linear-gradient(180deg,#fbf8f4_0%,#fff_100%)]">
      <section className="border-b border-[var(--porcia-border)]">
        <Container className="grid gap-12 py-16 lg:min-h-[72vh] lg:grid-cols-[1.06fr_0.94fr] lg:items-end lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]">
              <ArrowLeft size={12} />
              Back home
            </Link>

            <p className="mt-8 text-xs uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]">
              {pageLabel}
            </p>
            <h1 className="mt-6 font-serif text-[clamp(3rem,8vw,7rem)] font-light leading-[0.94] tracking-[-0.05em] text-[var(--porcia-fg)]">
              {page.title}
            </h1>
            {page.excerpt ? (
              <p className="mt-8 max-w-2xl text-[1.05rem] leading-8 text-[var(--porcia-text-secondary)] md:text-[1.15rem]">
                {page.excerpt}
              </p>
            ) : null}
          </motion.div>

          {page.media ? (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.05 }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[var(--porcia-border)] bg-[linear-gradient(180deg,#eadfd0,#b6a089_40%,#151515)] shadow-[0_30px_90px_rgba(0,0,0,0.16)]">
                <MediaAsset
                  src={page.media}
                  alt={page.title}
                  kind={page.mediaKind ?? "auto"}
                  priority
                  autoPlay={page.mediaKind === "video"}
                  muted={page.mediaKind === "video"}
                  loop={page.mediaKind === "video"}
                  className="absolute inset-0 h-full w-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
            </motion.div>
          ) : null}
        </Container>
      </section>

      <section className="py-20 lg:py-28">
        <Container>
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <Card variant="default" padding="xl" className="bg-white/80">
              <div className="wp-content max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
            </Card>
          </motion.article>
        </Container>
      </section>
    </div>
  );
}
