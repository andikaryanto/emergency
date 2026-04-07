import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "../../lib/blog-posts";
import { LandingHeader } from "../landing-header";

export const metadata: Metadata = {
  title: "Blog Klinik RME",
  description:
    "Artikel untuk pemilik klinik, admin, dan tim operasional yang ingin merapikan alur kerja, pelayanan pasien, dan keputusan harian di klinik.",
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
            <h1>Artikel untuk pemilik klinik, admin, dan tim operasional yang ingin kerja harian terasa lebih rapi.</h1>
            <p>
              Kami membahas persoalan yang sering muncul di meja depan, ruang praktik,
              kasir, sampai laporan harian. Isinya dibuat untuk orang yang menjalankan
              klinik setiap hari, bukan untuk pembaca yang hanya ingin teori.
            </p>
          </div>
        </div>
      </section>

      <section className="feature-panel">
        <div className="section-heading">
          <span className="eyebrow">Artikel Terbaru</span>
          <h2>Tulisan yang dekat dengan masalah nyata di operasional klinik.</h2>
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
