import Link from "next/link";
import { env } from "../lib/env";

const contactEmail = "hello@klinikrme.id";
const whatsappNumber = "62895405795064";
const whatsappDisplay = "+62 895-4057-95064";
const whatsappHref = `https://wa.me/${whatsappNumber}`;

const productLinks = [
  { href: "/produk", label: "Produk" },
  { href: "/fitur", label: "Fitur" },
  { href: "/harga", label: "Harga" },
  { href: "/faq", label: "FAQ" },
];

const companyLinks = [
  { href: "/contact", label: "Hubungi Kami" },
  { href: "/terms", label: "Kebijakan" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Buat Akun" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__intro">
          <Link href="/" className="brand-mark">
            <span className="brand-logo">+</span>
            <div>
              <p>{env.appName}</p>
              <span>Solusi Digital untuk Klinik Modern</span>
            </div>
          </Link>
          <p className="site-footer__copy">
            Platform untuk membantu operasional klinik menjadi lebih rapi,
            cepat, dan mudah dipakai oleh admin, kasir, dan tenaga medis.
          </p>
        </div>

        <div className="site-footer__group">
          <h2>Produk</h2>
          <nav className="site-footer__links" aria-label="Navigasi footer produk">
            {productLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="site-footer__group">
          <h2>Perusahaan</h2>
          <nav className="site-footer__links" aria-label="Navigasi footer perusahaan">
            {companyLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="site-footer__group">
          <h2>Kontak</h2>
          <div className="site-footer__contact">
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            <Link href={whatsappHref} target="_blank" rel="noreferrer">
              {whatsappDisplay}
            </Link>
            <p>Hubungi kami untuk tanya fitur, langganan, pembayaran, atau demo awal.</p>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© 2026 {env.appName}. Semua hak cipta dilindungi.</p>
        <div className="site-footer__bottom-links">
          <Link href="/terms">Syarat dan Ketentuan</Link>
          <Link href="/contact">Hubungi Kami</Link>
        </div>
      </div>
    </footer>
  );
}
