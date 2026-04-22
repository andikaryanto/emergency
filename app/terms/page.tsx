import type { Metadata } from "next";
import Link from "next/link";
import { LandingHeader } from "../landing-header";

export const metadata: Metadata = {
  title: "Syarat dan Ketentuan Penggunaan Klinik RME",
  description:
    "Baca syarat dan ketentuan Klinik RME mengenai penggunaan layanan, akun, pembayaran, pengembalian dana, dan tanggung jawab pengguna.",
  keywords: [
    "terms aplikasi klinik",
    "syarat dan ketentuan software klinik",
    "refund midtrans",
    "ketentuan layanan klinik rme",
  ],
  alternates: {
    canonical: "/terms",
  },
};

const keyPoints = [
  "Akun dan kredensial login menjadi tanggung jawab pengguna yang membuat atau mengelolanya.",
  "Data pasien, jadwal, transaksi, dan operasional yang diinput ke sistem wajib sah, akurat, dan sesuai kebutuhan klinik.",
  "Pembayaran langganan diproses melalui metode yang tersedia, termasuk Midtrans untuk kanal pembayaran tertentu.",
  "Pengembalian dana tidak dilakukan otomatis dan akan ditinjau berdasarkan kondisi transaksi dan status layanan.",
  "Klinik RME berhak membatasi akses jika terjadi tunggakan, penyalahgunaan, atau pelanggaran syarat layanan.",
  "Platform ini membantu operasional klinik, tetapi tidak menggantikan penilaian profesional, medis, atau kepatuhan hukum pengguna.",
];

const termsSections = [
  {
    title: "Definisi Layanan",
    paragraphs: [
      "Klinik RME adalah layanan perangkat lunak berbasis cloud untuk membantu operasional klinik, termasuk pengelolaan pasien, antrean, jadwal dokter, kasir, pembayaran, laporan, dan rekam medis elektronik sesuai fitur yang tersedia pada paket aktif.",
      "Layanan yang diberikan dapat berkembang dari waktu ke waktu. Fitur tertentu mungkin hanya tersedia pada paket berlangganan tertentu, masa trial, atau konfigurasi yang telah diaktifkan oleh pengguna.",
    ],
  },
  {
    title: "Pendaftaran dan Akun",
    paragraphs: [
      "Pengguna wajib memberikan informasi pendaftaran yang benar, terbaru, dan dapat dipertanggungjawabkan. Satu akun dapat digunakan untuk mengelola tenant atau klinik sesuai batasan sistem dan paket yang berlaku.",
      "Pengguna bertanggung jawab menjaga kerahasiaan email, password, kode verifikasi, dan akses internal lain yang digunakan untuk masuk ke sistem. Segala aktivitas yang terjadi melalui akun pengguna dianggap dilakukan oleh pemilik akun sampai pengguna memberi tahu kami tentang dugaan penyalahgunaan.",
    ],
  },
  {
    title: "Hak Akses dan Penggunaan yang Diperbolehkan",
    paragraphs: [
      "Pengguna memperoleh hak akses terbatas, tidak eksklusif, dan tidak dapat dipindahtangankan untuk memakai layanan sesuai tujuan operasional klinik dan ketentuan paket yang dipilih.",
      "Pengguna tidak diperkenankan menyalin, menjual kembali, menyewakan, mereverse engineer, mengganggu, atau menggunakan layanan untuk aktivitas yang melanggar hukum, merusak sistem, atau merugikan pihak lain.",
    ],
  },
  {
    title: "Data dan Tanggung Jawab Pengguna",
    paragraphs: [
      "Pengguna bertanggung jawab penuh atas keakuratan data yang dimasukkan ke sistem, termasuk data pasien, rekam medis, jadwal pelayanan, transaksi, invoice, dan data staf. Klinik RME menyediakan sarana pengelolaan data, namun isi dan validitas data tetap menjadi tanggung jawab pengguna.",
      "Pengguna juga bertanggung jawab memastikan penggunaan layanan sesuai kebijakan internal klinik, standar profesi, dan ketentuan hukum yang berlaku bagi operasional klinik masing-masing.",
    ],
  },
  {
    title: "Pembayaran, Tagihan, dan Midtrans",
    paragraphs: [
      "Biaya berlangganan mengikuti paket, periode tagihan, dan nominal yang ditampilkan pada saat transaksi atau invoice diterbitkan. Untuk kanal pembayaran tertentu, transaksi dapat diproses melalui Midtrans sebagai mitra payment gateway.",
      "Pengguna memahami bahwa persetujuan atau penolakan transaksi dapat dipengaruhi oleh bank, e-wallet, penerbit kartu, Midtrans, atau kebijakan antifraud pihak terkait. Kewajiban pembayaran dianggap selesai setelah sistem menerima konfirmasi pembayaran yang valid.",
      "Kegagalan menyelesaikan pembayaran, tagihan yang jatuh tempo, atau transaksi yang dibatalkan dapat menyebabkan penundaan aktivasi, penghentian perpanjangan, atau pembatasan akses sampai kewajiban diselesaikan.",
    ],
  },
  {
    title: "Kebijakan Pengembalian Dana",
    paragraphs: [
      "Pengembalian dana tidak diberikan secara otomatis untuk setiap transaksi yang telah berhasil. Permohonan refund dapat dipertimbangkan antara lain apabila terjadi pembayaran ganda, tagihan terbayar tetapi layanan tidak aktif karena kesalahan sistem kami, atau terdapat kesalahan nominal yang terbukti berasal dari sisi sistem.",
      "Refund pada umumnya tidak berlaku untuk perubahan keputusan setelah layanan aktif, ketidaksesuaian ekspektasi yang sudah dijelaskan di halaman produk atau paket, kelalaian pengguna dalam memakai fitur, atau akun yang dibatasi karena pelanggaran syarat layanan.",
      "Apabila refund disetujui, pengembalian akan diproses ke metode pembayaran asal atau mekanisme lain yang memungkinkan sesuai ketentuan Midtrans, bank, atau penyedia pembayaran terkait. Waktu penyelesaian dapat berbeda-beda, namun secara umum diproses dalam estimasi 7 sampai 14 hari kerja setelah persetujuan refund.",
      "Midtrans bertindak sebagai pemroses pembayaran dan bukan pihak yang menetapkan kelayakan refund atas layanan Klinik RME. Keputusan refund tetap mengacu pada peninjauan transaksi dan status layanan oleh kami.",
    ],
  },
  {
    title: "Ketersediaan Layanan dan Pemeliharaan",
    paragraphs: [
      "Kami berupaya menjaga layanan tetap tersedia dan aman, namun tidak menjamin layanan akan selalu bebas gangguan, bebas bug, atau tersedia tanpa jeda setiap saat. Pemeliharaan berkala, pembaruan fitur, gangguan pihak ketiga, maupun keadaan di luar kendali kami dapat memengaruhi akses sementara.",
      "Kami dapat melakukan perubahan, pembaruan, perbaikan, atau penghentian sebagian fitur dengan pemberitahuan yang wajar apabila diperlukan untuk keamanan, peningkatan layanan, atau penyesuaian operasional.",
    ],
  },
  {
    title: "Batas Tanggung Jawab",
    paragraphs: [
      "Klinik RME disediakan sebagai alat bantu operasional. Layanan ini tidak dimaksudkan untuk menggantikan keputusan medis, pertimbangan profesional, audit internal, atau kewajiban hukum klinik. Pengguna tetap bertanggung jawab atas keputusan layanan kesehatan, tindakan medis, dan penggunaan data pasien di lingkungan kerjanya.",
      "Sepanjang diizinkan hukum yang berlaku, kami tidak bertanggung jawab atas kerugian tidak langsung, kehilangan keuntungan, kehilangan data akibat kelalaian pengguna, atau gangguan yang timbul dari layanan pihak ketiga, koneksi internet, perangkat pengguna, atau force majeure.",
    ],
  },
  {
    title: "Pelanggaran dan Penghentian Akses",
    paragraphs: [
      "Kami berhak menangguhkan, membatasi, atau menghentikan akses pengguna apabila ditemukan indikasi penyalahgunaan sistem, pelanggaran syarat ini, aktivitas yang berisiko terhadap keamanan layanan, atau kewajiban pembayaran yang tidak diselesaikan.",
      "Dalam kondisi tertentu, kami dapat memberikan kesempatan perbaikan terlebih dahulu. Namun untuk pelanggaran yang berdampak pada keamanan, hukum, atau integritas sistem, tindakan pembatasan akses dapat dilakukan segera.",
    ],
  },
  {
    title: "Perubahan Ketentuan",
    paragraphs: [
      "Syarat dan ketentuan ini dapat diperbarui dari waktu ke waktu untuk menyesuaikan fitur, proses bisnis, atau kewajiban hukum dan operasional. Versi terbaru yang ditampilkan di halaman ini berlaku sejak tanggal pembaruan yang disebutkan.",
      "Dengan tetap menggunakan layanan setelah perubahan berlaku, pengguna dianggap telah membaca dan menyetujui versi terbaru dari syarat dan ketentuan ini.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="page-shell">
      <section className="hero-section">
        <LandingHeader />

        <div className="hero-grid legal-hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Legal</span>
            <h1>Syarat dan ketentuan penggunaan Klinik RME.</h1>
            <p>
              Halaman ini menjelaskan aturan dasar penggunaan layanan, akun,
              pembayaran, pengembalian dana, serta tanggung jawab pengguna saat
              memakai Klinik RME untuk operasional klinik.
            </p>
            <p className="legal-effective-date">Berlaku sejak 22 April 2026.</p>
          </div>

          <div className="mini-card legal-summary-card">
            <span className="card-label">Ringkasan cepat</span>
            <strong>Gunakan layanan secara wajar, akurat, dan sesuai paket aktif.</strong>
            <p>
              Jika ada pembayaran ganda atau kendala aktivasi akibat sistem,
              refund bisa diajukan untuk ditinjau. Untuk pertanyaan umum, Anda
              juga bisa melihat halaman FAQ.
            </p>
            <Link href="/faq" className="ghost-button">
              Buka FAQ
            </Link>
          </div>
        </div>
      </section>

      <section className="feature-panel" aria-labelledby="terms-highlights-heading">
        <div className="section-heading">
          <span className="eyebrow">Poin Penting</span>
          <h2 id="terms-highlights-heading">Hal yang paling sering perlu dipahami sebelum memakai layanan.</h2>
          <p>
            Ringkasan ini membantu pengguna memahami kewajiban dasar, alur
            pembayaran, dan konteks refund tanpa harus membaca seluruh halaman
            terlebih dahulu.
          </p>
        </div>

        <div className="highlight-grid legal-highlight-grid">
          {keyPoints.map((item) => (
            <article key={item} className="info-card">
              <div className="icon-chip" />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-section legal-sections" aria-labelledby="terms-sections-heading">
        <div className="section-heading">
          <span className="eyebrow">Isi Ketentuan</span>
          <h2 id="terms-sections-heading">Penjelasan lengkap mengenai penggunaan layanan dan transaksi.</h2>
          <p>
            Setiap bagian di bawah ini ditulis agar mudah ditinjau oleh pemilik
            klinik, admin, maupun tim operasional sebelum mulai memakai sistem.
          </p>
        </div>

        <div className="pricing-grid legal-grid">
          {termsSections.map((section) => (
            <article key={section.title} className="pricing-card legal-card">
              <div>
                <h3>{section.title}</h3>
                <div className="legal-copy">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div>
          <span className="eyebrow">Lanjutkan</span>
          <h2>Sudah cocok? Lihat FAQ atau mulai buat akun.</h2>
          <p>
            Jika Anda ingin meninjau fitur dan alur langganan lebih lanjut,
            lanjutkan ke FAQ atau langsung daftar untuk mencoba Klinik RME.
          </p>
        </div>
        <div className="cta-actions">
          <Link href="/faq" className="ghost-button ghost-inverse">
            Buka FAQ
          </Link>
          <Link href="/signup" className="primary-button">
            Buat Akun
          </Link>
        </div>
      </section>
    </main>
  );
}
