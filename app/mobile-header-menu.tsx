"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function MobileHeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="mobile-menu-root">
      <button
        type="button"
        className="mobile-menu-button"
        aria-expanded={isOpen}
        aria-controls="mobile-header-menu"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? "Tutup" : "Menu"}
      </button>

      {isOpen ? (
        <div id="mobile-header-menu" className="mobile-menu-panel">
          <nav className="mobile-menu-links" aria-label="Navigasi mobile">
            <a href="#produk" onClick={() => setIsOpen(false)}>
              Produk
            </a>
            <a href="#fitur" onClick={() => setIsOpen(false)}>
              Fitur
            </a>
            <a href="#harga" onClick={() => setIsOpen(false)}>
              Harga
            </a>
            <Link href="/login" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          </nav>

          <div className="mobile-menu-actions">
            <Link className="ghost-button" href="/login" onClick={() => setIsOpen(false)}>
              Login
            </Link>
            <Link className="primary-button" href="/signup" onClick={() => setIsOpen(false)}>
              Coba Sekarang
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
