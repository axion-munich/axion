import Link from "next/link";
import { blogPosts } from "@/data/blog-posts";

export const metadata = {
  title: "Blog",
  description:
    "Insights on student consulting, Munich startups, fundraising, and career development from axion Munich.",
};

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main className="axion-container axion-section max-w-3xl space-y-8">
      <Link
        href="/"
        className="inline-flex rounded-full border border-border bg-card/70 px-4 py-2 text-sm text-foreground transition hover:bg-accent"
      >
        Back to home
      </Link>

      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Blog
        </p>
        <h1 className="axion-title text-4xl text-foreground">
          Insights &amp; Resources
        </h1>
        <p className="text-sm leading-7 text-muted-foreground md:text-base">
          Practical articles on student consulting, Munich&apos;s startup
          ecosystem, fundraising, and building your career.
        </p>
      </div>

      <div className="space-y-6">
        {sorted.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block rounded-2xl border border-border bg-card/70 p-6 transition hover:bg-accent"
          >
            <div className="space-y-2">
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
              <h2 className="text-lg font-semibold text-foreground">
                {post.title}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground md:text-base">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
