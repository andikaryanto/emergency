import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPostBySlug } from "../../../lib/blog-posts";
import { LandingHeader } from "../../landing-header";

type BlogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: "/blog/" + post.slug,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="page-shell">
      <section className="hero-section">
        <LandingHeader />

        <div className="blog-hero">
          <span className="eyebrow">Artikel</span>
          <h1>{post.title}</h1>
          <p className="blog-meta">{post.publishedAt} · {post.readingTime}</p>
          <p className="blog-intro">{post.description}</p>
        </div>
      </section>

      <article className="feature-panel blog-article">
        <div className="blog-prose">
          {post.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {post.sections.map((section) => (
            <section key={section.heading} className="blog-section">
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}

          <section className="blog-section">
            <h2>Penutup</h2>
            {post.closing.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        </div>
      </article>

      <section className="cta-section">
        <div>
          <span className="eyebrow">Bacaan Lainnya</span>
          <h2>Masih ingin membaca topik lain seputar operasional klinik?</h2>
          <p>
            Anda bisa kembali ke halaman blog atau langsung melihat bagaimana
            Klinik RME dipakai untuk merapikan alur kerja harian di klinik.
          </p>
        </div>
        <div className="cta-actions">
          <Link href="/blog" className="ghost-button ghost-inverse">
            Kembali ke Blog
          </Link>
          <Link href="/signup" className="primary-button">
            Coba Klinik RME
          </Link>
        </div>
      </section>
    </main>
  );
}
