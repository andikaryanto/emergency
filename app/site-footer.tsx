import Link from "next/link";
import { env } from "../lib/env";

const contactEmail = "hello@klinikrme.id";
const instagramHref = "https://www.instagram.com/zura.technologies";
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

type ContactLinkProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
};

function ContactLink({ href, label, icon, external = false }: ContactLinkProps) {
  return (
    <Link
      href={href}
      className="site-footer__contact-link"
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <span className="site-footer__contact-icon" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}

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
            <ContactLink
              href={`mailto:${contactEmail}`}
              label={contactEmail}
              icon={
                <svg viewBox="0 0 24 24" focusable="false">
                  <path
                    d="M4 6.75h16A1.25 1.25 0 0 1 21.25 8v8A1.25 1.25 0 0 1 20 17.25H4A1.25 1.25 0 0 1 2.75 16V8A1.25 1.25 0 0 1 4 6.75Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m3.5 8 7.7 5.78a1.4 1.4 0 0 0 1.6 0L20.5 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <ContactLink
              href={instagramHref}
              label="Instagram"
              external
              icon={
                <svg viewBox="0 0 24 24" focusable="false">
                  <rect
                    x="3.25"
                    y="3.25"
                    width="17.5"
                    height="17.5"
                    rx="5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4.1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <circle cx="17.45" cy="6.55" r="1.15" fill="currentColor" />
                </svg>
              }
            />
            <ContactLink
              href={whatsappHref}
              label={whatsappDisplay}
              external
              icon={
                <svg viewBox="0 0 24 24" focusable="false">
                  <path
                    d="M12 3.25a8.7 8.7 0 0 0-7.53 13.06L3.25 20.75l4.57-1.2A8.75 8.75 0 1 0 12 3.25Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.15 8.9c.2-.45.42-.46.62-.47h.53c.16 0 .38.06.58.5.2.43.69 1.67.75 1.79.06.12.1.27.02.43-.08.16-.12.26-.24.39-.12.14-.25.3-.35.4-.12.13-.25.27-.1.53.15.26.67 1.11 1.44 1.79.99.88 1.82 1.15 2.08 1.28.26.13.41.11.56-.07.15-.18.64-.75.8-1.01.16-.26.33-.22.56-.13.23.09 1.47.69 1.72.81.25.13.41.19.47.3.06.11.06.66-.15 1.3-.2.64-1.18 1.22-1.63 1.29-.42.06-.95.09-1.54-.1-.36-.11-.81-.26-1.39-.51-2.45-1.06-4.05-3.62-4.17-3.79-.12-.17-1-1.33-1-2.53 0-1.2.63-1.79.85-2.03Z"
                    fill="currentColor"
                  />
                </svg>
              }
            />
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
