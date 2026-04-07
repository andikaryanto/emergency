import Link from "next/link";
import { MobileHeaderMenu } from "./mobile-header-menu";
import { landingNavLinks } from "./landing-navigation";

export function LandingHeader() {
  return (
    <div className="nav-wrap">
      <Link href="/" className="brand-mark">
        <span className="brand-logo">+</span>
        <div>
          <p>Klinik RME</p>
          <span>Solusi Digital untuk Klinik Modern</span>
        </div>
      </Link>
      <nav className="nav-links" aria-label="Navigasi utama">
        {landingNavLinks.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <Link href="/login">Login</Link>
      </nav>
      <div className="nav-actions">
        <Link className="ghost-button" href="/login">
          Login
        </Link>
        <Link className="primary-button" href="/signup">
          Coba Sekarang
        </Link>
      </div>
      <MobileHeaderMenu />
    </div>
  );
}
