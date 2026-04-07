import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "../../lib/blog-posts";
import { LandingHeader } from "../landing-header";

export const metadata: Metadata = {
  title: "Blog Klinik RME",
  description:
    "Artikel seputar operasional klinik, software klinik, dan rekam medis elektronik untuk membantu klinik bekerja lebih rapi dan efisien.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return (
    <main className="page-shell">
      <section className="hero-section">
        <LandingHeader />

        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Blog Klinik RME</span>
            <h1>Artikel yang membahas operasional klinik dengan bahasa yang jelas dan tidak berputar-putar.</h1>
            <p>
              Blog ini ditujukan untuk pemilik klinik, admin, dan tim operasional
              yang ingin membaca persoalan sehari-hari dengan sudut pandang yang lebih praktis.
            </p>
          </div>
        </div>
      </section>

      <section className="feature-panel">
        <div className="section-heading">
          <span className="eyebrow">Artikel Terbaru</span>
          <h2>Kumpulan tulisan yang membahas persoalan klinik dari sisi operasional yang nyata.</h2>
        </div>

        <div className="blog-list">
          {blogPosts.map((post) => (
            <article key={post.slug} className="info-card blog-card">
              <p className="blog-card-meta">{post.publishedAt} · {post.readingTime}</p>
              <h3>
                <Link href={"/blog/" + post.slug} className="blog-card-title-link">
                  {post.title}
                </Link>
              </h3>
              <p>{post.description}</p>
              <Link href={"/blog/" + post.slug} className="ghost-button">
                Baca Artikel
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
