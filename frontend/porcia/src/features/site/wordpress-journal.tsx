"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Card, Container, MediaAsset } from "@/components/ui";
import { type WordPressCard } from "@/lib/wordpress";

interface JournalListProps {
  posts: WordPressCard[];
}

interface JournalDetailProps {
  post: WordPressCard;
}

function formatDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function stripTags(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function WordPressJournalList({ posts }: JournalListProps) {
  return (
    <div className="bg-[linear-gradient(180deg,#fbf8f4_0%,#ffffff_100%)]">
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card variant="default" padding="none" hover className="group h-full overflow-hidden">
                    <div className="relative aspect-[4/5] bg-[linear-gradient(180deg,#ddcfbf,#8d7c6c)]">
                      {post.media ? (
                        <MediaAsset
                          src={post.media}
                          alt={post.title}
                          kind={post.mediaKind ?? "auto"}
                          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      ) : null}
                    </div>
                    <div className="grid gap-3 p-7">
                      {post.date ? (
                        <p className="text-[11px] uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]">
                          {formatDate(post.date)}
                        </p>
                      ) : null}
                      <h1 className="font-serif text-2xl font-light leading-tight tracking-[-0.03em]">
                        {post.title}
                      </h1>
                      <p className="text-sm leading-7 text-[var(--porcia-text-secondary)]">
                        {post.excerpt || stripTags(post.content).slice(0, 140)}
                      </p>
                    </div>
                  </Card>
                </Link>
              </motion.article>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

export function WordPressJournalDetail({ post }: JournalDetailProps) {
  return (
    <div className="bg-[linear-gradient(180deg,#fbf8f4_0%,#fff_100%)]">
      <section className="border-b border-[var(--porcia-border)]">
        <Container className="py-16 lg:py-20">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]"
          >
            <ArrowLeft size={12} />
            Back
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="mt-8 max-w-4xl"
          >
            {post.date ? (
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--porcia-text-muted)]">
                {formatDate(post.date)}
              </p>
            ) : null}
            <h1 className="mt-6 font-serif text-[clamp(3rem,8vw,6.75rem)] font-light leading-[0.95] tracking-[-0.05em]">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-6 max-w-3xl text-[1.05rem] leading-8 text-[var(--porcia-text-secondary)]">
                {post.excerpt}
              </p>
            ) : null}
          </motion.div>
        </Container>
      </section>

      {post.media ? (
        <section className="px-4 py-8 md:px-6 lg:px-8">
          <Container>
            <div className="relative h-[52vh] overflow-hidden rounded-[2rem] border border-[var(--porcia-border)] bg-[linear-gradient(180deg,#d9cbbb,#8f7c69)]">
              <MediaAsset
                src={post.media}
                alt={post.title}
                kind={post.mediaKind ?? "auto"}
                className="absolute inset-0 h-full w-full object-cover"
                sizes="100vw"
              />
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-16 lg:py-24">
        <Container>
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Card variant="default" padding="xl" className="bg-white/80">
              <div className="wp-content max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            </Card>
          </motion.article>
        </Container>
      </section>
    </div>
  );
}
