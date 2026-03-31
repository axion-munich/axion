import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts } from "@/data/blog-posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      url: `https://axion-munich.de/blog/${post.slug}`,
    },
    alternates: {
      canonical: `https://axion-munich.de/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <main className="axion-container axion-section max-w-3xl space-y-8">
      <Link
        href="/blog"
        className="inline-flex rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-foreground transition hover:bg-accent"
      >
        Back to blog
      </Link>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="font-semibold uppercase tracking-[0.18em] text-primary">
            {post.eyebrow}
          </span>
          <span>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <h1 className="axion-title text-4xl text-foreground">{post.title}</h1>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          {post.excerpt}
        </p>
      </div>

      {post.sections.map((section) => (
        <section key={section.heading} className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            {section.heading}
          </h2>
          {section.body.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="text-sm leading-7 text-muted-foreground md:text-base"
            >
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </main>
  );
}
