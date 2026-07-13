"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui";
import type { HomeAcf, WordPressCard } from "@/lib/wordpress";

// ─── ANIMATION VARIANTS ──────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.9, ease: "easeOut", delay },
  }),
};

const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

// ─── LABEL COMPONENT ─────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.42em] text-[var(--porcia-text-muted)] font-light">
      {text}
    </p>
  );
}

// ─── DIVIDER ─────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="w-8 h-px bg-[var(--porcia-gold)] my-6 opacity-60" />
  );
}

// ─── PROPS ───────────────────────────────────────────────────────────────────

interface WordPressHomeProps {
  acf: HomeAcf;
  latestPosts: WordPressCard[];
}

// ─── SECTION 1: HERO ─────────────────────────────────────────────────────────

function HeroSection({ acf }: { acf: HomeAcf }) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  const heading = acf.hero_title;
  const subtext = acf.hero_descrption;
  const image = acf.hero_media_link;
  const btnText = acf.hero_button_text;
  const btnLink = acf.hero_button_link;

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden min-h-[100svh] flex items-center border-b border-[var(--porcia-border)]"
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(201,169,97,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 80%, rgba(184,154,125,0.08) 0%, transparent 60%)",
        }}
      />

      <Container className="relative z-10 w-full grid lg:grid-cols-[1fr_0.85fr] gap-16 lg:gap-24 items-center py-28 lg:py-36">
        {/* LEFT — Text */}
        <motion.div style={{ y: textY }} className="flex flex-col">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <SectionLabel text="Maison Porcia" />
          </motion.div>

          {heading && (
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="mt-8 font-serif font-light leading-[0.88] tracking-[-0.04em]"
              style={{ fontSize: "clamp(3.8rem, 8.5vw, 8rem)" }}
            >
              {heading}
            </motion.h1>
          )}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.25}
          >
            <Divider />
          </motion.div>

          {subtext && (
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="max-w-sm text-[1rem] leading-[1.9] text-[var(--porcia-text-secondary)] font-light"
            >
              {subtext}
            </motion.p>
          )}

          {(btnText || btnLink) && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.45}
              className="mt-12 flex items-center gap-6"
            >
              <Link
                href={btnLink ?? "/shop"}
                className="group inline-flex h-[3.25rem] items-center gap-3 rounded-none border border-[var(--porcia-black)] bg-[var(--porcia-black)] px-9 text-[10px] uppercase tracking-[0.38em] text-white transition-all duration-500 hover:bg-transparent hover:text-[var(--porcia-black)]"
              >
                {btnText ?? "Explore"}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/collections"
                className="text-[10px] uppercase tracking-[0.35em] text-[var(--porcia-text-muted)] border-b border-[var(--porcia-border)] pb-0.5 transition-colors hover:text-[var(--porcia-black)] hover:border-[var(--porcia-black)]"
              >
                View All
              </Link>
            </motion.div>
          )}

          {/* Scroll indicator */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={0.8}
            className="mt-20 hidden lg:flex items-center gap-3"
          >
            <div className="w-px h-10 bg-[var(--porcia-border)] relative overflow-hidden">
              <motion.div
                className="absolute inset-x-0 top-0 bg-[var(--porcia-gold)]"
                animate={{ height: ["0%", "100%", "0%"], top: ["0%", "0%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <span className="text-[9px] uppercase tracking-[0.4em] text-[var(--porcia-text-muted)]">
              Scroll
            </span>
          </motion.div>
        </motion.div>

        {/* RIGHT — Image */}
        {image && (
          <motion.div
            variants={scaleReveal}
            initial="hidden"
            animate="visible"
            custom={0.15}
            style={{ y: imageY }}
            className="relative"
          >
            {/* Decorative frame lines */}
            <div className="absolute -inset-4 pointer-events-none">
              <div className="absolute top-0 left-0 w-10 h-10 border-t border-l border-[var(--porcia-gold)] opacity-50" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-[var(--porcia-gold)] opacity-50" />
            </div>

            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={image}
                alt={acf.hero_title ?? "Porcia"}
                fill
                priority
                className="object-cover transition-transform duration-[2s] ease-out hover:scale-[1.04]"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Caption badge */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.6}
              className="absolute -bottom-6 -left-6 bg-[var(--porcia-bg)] border border-[var(--porcia-border)] px-5 py-3 shadow-sm"
            >
              <p className="text-[9px] uppercase tracking-[0.38em] text-[var(--porcia-text-muted)]">
                New Season
              </p>
              <p className="text-sm font-serif font-light mt-0.5 tracking-wide">
                SS 2026
              </p>
            </motion.div>
          </motion.div>
        )}
      </Container>
    </section>
  );
}

// ─── SECTION 2: BRAND STATEMENT ──────────────────────────────────────────────

function StatementSection({ acf }: { acf: HomeAcf }) {
  const label = acf.statement_label;
  const heading = acf.statement_heading;
  const body = acf.statement_body;

  if (!heading && !body) return null;

  return (
    <section className="py-32 lg:py-44 border-b border-[var(--porcia-border)] overflow-hidden">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          {label && (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <SectionLabel text={label} />
            </motion.div>
          )}

          {heading && (
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0.1}
              className="mt-8 font-serif font-light leading-[1.08] tracking-[-0.035em] text-[var(--porcia-black)]"
              style={{ fontSize: "clamp(2.6rem, 5.5vw, 5rem)" }}
            >
              {heading}
            </motion.h2>
          )}

          {body && (
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0.22}
              className="mt-8 text-[1.05rem] leading-[2] text-[var(--porcia-text-secondary)] max-w-2xl mx-auto font-light"
            >
              {body}
            </motion.p>
          )}

          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.35}
            className="mt-10 flex justify-center"
          >
            <div className="w-16 h-px bg-[var(--porcia-gold)] opacity-50" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

// ─── SECTION 3: FEATURED COLLECTION ─────────────────────────────────────────

function CollectionSection({ acf }: { acf: HomeAcf }) {
  const label = acf.collection_label;
  const heading = acf.collection_heading;
  const linkText = acf.collection_link_text;
  const linkUrl = acf.collection_link_url;
  const image = acf.collection_image;

  if (!heading && !image) return null;

  return (
    <section className="py-0 border-b border-[var(--porcia-border)] overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[85vh]">
        {/* LEFT — Text panel */}
        <div className="flex flex-col justify-center px-8 py-24 lg:px-16 lg:py-32 xl:px-24 border-r border-[var(--porcia-border)]">
          {label && (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <SectionLabel text={label} />
            </motion.div>
          )}

          {heading && (
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0.1}
              className="mt-8 font-serif font-light leading-[1.05] tracking-[-0.04em]"
              style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)" }}
            >
              {heading}
            </motion.h2>
          )}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2}
          >
            <Divider />
          </motion.div>

          {(linkText || linkUrl) && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0.28}
            >
              <Link
                href={linkUrl ?? "/collections"}
                className="group inline-flex h-[3rem] items-center gap-3 border border-[var(--porcia-black)] px-8 text-[10px] uppercase tracking-[0.38em] transition-all duration-500 hover:bg-[var(--porcia-black)] hover:text-white"
              >
                {linkText ?? "View Collection"}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>
          )}
        </div>

        {/* RIGHT — Tall image */}
        {image && (
          <motion.div
            variants={scaleReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            custom={0.05}
            className="relative min-h-[60vh] lg:min-h-full overflow-hidden"
          >
            <Image
              src={image}
              alt={heading ?? "Porcia Collection"}
              fill
              className="object-cover transition-transform duration-[2.5s] ease-out hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/15 pointer-events-none" />
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ─── SECTION 4: HOUSE PAGES GRID ─────────────────────────────────────────────

const DEFAULT_HOUSE_PAGES = [
  { page_title: "House", page_description: "The story of Porcia — our heritage, values, and vision.", page_slug: "house" },
  { page_title: "Collections", page_description: "Seasonal expressions of our craft, available now.", page_slug: "collections" },
  { page_title: "Lookbook", page_description: "Editorial imagery from our latest collections.", page_slug: "lookbook" },
  { page_title: "Appointment", page_description: "Reserve a private styling session at our atelier.", page_slug: "appointment" },
];

function HouseGrid({ acf }: { acf: HomeAcf }) {
  const label = acf.house_label;
  const heading = acf.house_heading;
  const pages = (acf.house_pages && acf.house_pages.length > 0)
    ? acf.house_pages
    : DEFAULT_HOUSE_PAGES;

  const romanNumerals = ["I", "II", "III", "IV", "V", "VI"];

  return (
    <section className="py-28 lg:py-36 border-b border-[var(--porcia-border)] bg-[#f9f7f3]">
      <Container>
        {/* Header */}
        <div className="flex items-end justify-between mb-16 lg:mb-20">
          <div>
            {label && (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <SectionLabel text={label} />
              </motion.div>
            )}
            {heading && (
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                custom={0.1}
                className="mt-4 font-serif font-light tracking-[-0.03em]"
                style={{ fontSize: "clamp(2rem, 3.5vw, 3.2rem)" }}
              >
                {heading}
              </motion.h2>
            )}
          </div>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="hidden lg:block"
          >
            <div className="w-20 h-px bg-[var(--porcia-border)]" />
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--porcia-border)]">
          {pages.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i * 0.07}
            >
              <Link
                href={p.page_slug ? `/${p.page_slug}` : "#"}
                className="group flex flex-col bg-[#f9f7f3] p-8 lg:p-10 min-h-[280px] lg:min-h-[340px] transition-colors duration-300 hover:bg-white"
              >
                <div className="flex items-start justify-between mb-auto">
                  <span
                    className="font-serif text-[2.5rem] font-light text-[var(--porcia-border)] leading-none transition-colors duration-300 group-hover:text-[var(--porcia-gold)] group-hover:opacity-80"
                    style={{ fontVariantNumeric: "oldstyle-nums" }}
                  >
                    {romanNumerals[i] ?? String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[var(--porcia-text-muted)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5 text-sm">
                    ↗
                  </span>
                </div>

                <div className="mt-8">
                  {p.page_title && (
                    <h3 className="font-serif text-xl font-light tracking-[-0.01em] leading-tight">
                      {p.page_title}
                    </h3>
                  )}
                  {p.page_description && (
                    <p className="mt-3 text-[0.82rem] leading-[1.8] text-[var(--porcia-text-muted)] font-light">
                      {p.page_description}
                    </p>
                  )}
                </div>

                {/* Bottom line reveal */}
                <div className="mt-6 overflow-hidden">
                  <div className="h-px bg-[var(--porcia-black)] origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─── SECTION 5: JOURNAL PREVIEW ───────────────────────────────────────────────

function JournalSection({ posts }: { posts: WordPressCard[] }) {
  if (posts.length === 0) return null;

  function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <section className="py-28 lg:py-36 border-b border-[var(--porcia-border)]">
      <Container>
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <div>
            <SectionLabel text="From the Journal" />
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              custom={0.08}
              className="mt-4 font-serif font-light tracking-[-0.03em]"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3.2rem)" }}
            >
              Notes on Craft
            </motion.h2>
          </div>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link
              href="/blog"
              className="hidden lg:inline-flex text-[10px] uppercase tracking-[0.35em] text-[var(--porcia-text-muted)] border-b border-[var(--porcia-border)] pb-0.5 transition-all hover:text-[var(--porcia-black)] hover:border-[var(--porcia-black)]"
            >
              All Posts →
            </Link>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-3 gap-0 border-t border-[var(--porcia-border)]">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              custom={i * 0.08}
              className={i < posts.length - 1 ? "lg:border-r border-[var(--porcia-border)]" : ""}
            >
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#ece9e4]">
                  {post.media ? (
                    <Image
                      src={post.media}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.05]"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e0d8ce] to-[#c8bfb2]" />
                  )}
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />
                </div>

                {/* Text */}
                <div className="p-8 lg:p-9 border-b border-[var(--porcia-border)]">
                  <p className="text-[9px] uppercase tracking-[0.4em] text-[var(--porcia-text-muted)]">
                    {formatDate(post.date)}
                  </p>
                  <h3 className="mt-4 font-serif text-[1.3rem] font-light leading-tight tracking-[-0.02em] transition-opacity group-hover:opacity-70">
                    {post.title}
                  </h3>
                  <p className="mt-4 text-[0.82rem] leading-[1.85] text-[var(--porcia-text-secondary)] line-clamp-3">
                    {post.excerpt || post.content.replace(/<[^>]*>/g, "").slice(0, 120)}
                  </p>
                  <p className="mt-5 text-[9px] uppercase tracking-[0.35em] text-[var(--porcia-text-muted)] transition-all duration-300 group-hover:tracking-[0.45em]">
                    Read →
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 flex justify-center lg:hidden">
          <Link
            href="/blog"
            className="text-[10px] uppercase tracking-[0.35em] text-[var(--porcia-text-muted)] border-b border-[var(--porcia-border)] pb-0.5"
          >
            All Posts →
          </Link>
        </div>
      </Container>
    </section>
  );
}

// ─── SECTION 6: CONCIERGE CTA ─────────────────────────────────────────────────

function ConciergeSection({ acf }: { acf: HomeAcf }) {
  const label = acf.concierge_label;
  const heading = acf.concierge_heading;
  const body = acf.concierge_body;
  const btnText = acf.concierge_button_text;
  const btnLink = acf.concierge_button_link;
  const secText = acf.concierge_secondary_text;
  const secLink = acf.concierge_secondary_link;

  return (
    <section className="relative overflow-hidden py-36 lg:py-48 bg-[#0d0d0d]">
      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,169,97,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Corner ornaments */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-white/10" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-white/10" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-white/10" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-white/10" />

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {label && (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <p className="text-[10px] uppercase tracking-[0.42em] text-[var(--porcia-gold)] font-light opacity-80">
                {label}
              </p>
            </motion.div>
          )}

          {heading && (
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0.1}
              className="mt-8 font-serif font-light leading-[1.08] tracking-[-0.04em] text-white"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)" }}
            >
              {heading}
            </motion.h2>
          )}

          {!heading && (
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0.1}
              className="mt-8 font-serif font-light leading-[1.08] tracking-[-0.04em] text-white"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)" }}
            >
              A Private Experience,<br />Crafted for You
            </motion.h2>
          )}

          {body && (
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={0.2}
              className="mt-8 text-[1rem] leading-[2] text-white/55 max-w-xl mx-auto font-light"
            >
              {body}
            </motion.p>
          )}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={0.3}
            className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {(btnText || btnLink) && (
              <Link
                href={btnLink ?? "/appointment"}
                className="group inline-flex h-[3.25rem] items-center gap-3 border border-white/90 bg-white/90 px-9 text-[10px] uppercase tracking-[0.38em] text-[#0d0d0d] transition-all duration-500 hover:bg-transparent hover:text-white hover:border-white"
              >
                {btnText ?? "Book an Appointment"}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            )}

            {(secText || secLink) && (
              <Link
                href={secLink ?? "/contact"}
                className="inline-flex h-[3.25rem] items-center gap-3 border border-white/20 px-9 text-[10px] uppercase tracking-[0.38em] text-white/60 transition-all duration-500 hover:border-white/50 hover:text-white"
              >
                {secText ?? "Contact Us"}
              </Link>
            )}

            {!btnText && !btnLink && !secText && !secLink && (
              <>
                <Link
                  href="/appointment"
                  className="group inline-flex h-[3.25rem] items-center gap-3 border border-white/90 bg-white/90 px-9 text-[10px] uppercase tracking-[0.38em] text-[#0d0d0d] transition-all duration-500 hover:bg-transparent hover:text-white hover:border-white"
                >
                  Book Appointment
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-[3.25rem] items-center gap-3 border border-white/20 px-9 text-[10px] uppercase tracking-[0.38em] text-white/60 transition-all duration-500 hover:border-white/50 hover:text-white"
                >
                  Contact Us
                </Link>
              </>
            )}
          </motion.div>

          {/* Gold line */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.45}
            className="mt-16 flex justify-center"
          >
            <div className="w-16 h-px bg-[var(--porcia-gold)] opacity-30" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export function WordPressHome({ acf, latestPosts }: WordPressHomeProps) {
  return (
    <div className="bg-[var(--porcia-bg)]">
      <HeroSection acf={acf} />
      <StatementSection acf={acf} />
      <CollectionSection acf={acf} />
      <HouseGrid acf={acf} />
      <JournalSection posts={latestPosts} />
      <ConciergeSection acf={acf} />
    </div>
  );
}
