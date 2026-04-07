export type BlogPostSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
  keywords: string[];
  intro: string[];
  sections: BlogPostSection[];
  closing: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "tanda-klinik-sudah-perlu-aplikasi-manajemen",
    title: "5 Tanda Klinik Sudah Perlu Aplikasi Manajemen, Bukan Pencatatan Manual Lagi",
    description:
      "Tanda-tanda operasional klinik mulai kewalahan dengan pencatatan manual, dan kenapa aplikasi manajemen klinik jadi langkah yang lebih masuk akal.",
    publishedAt: "2026-04-07",
    readingTime: "6 menit baca",
    keywords: [
      "aplikasi manajemen klinik",
      "software klinik",
      "operasional klinik",
      "rekam medis elektronik",
    ],
    intro: [
      "Banyak klinik tidak langsung merasa butuh software. Selama pasien masih terlayani, kasir masih bisa mencatat, dan dokter masih bisa melihat riwayat seperlunya, sistem manual terasa cukup aman.",
      "Masalahnya biasanya tidak datang sekaligus. Awalnya hanya antrean yang mulai berantakan di jam ramai. Besoknya invoice ada yang dobel. Minggu depannya pemilik klinik minta laporan cepat, tapi staf perlu bongkar catatan satu per satu.",
      "Kalau gejalanya sudah mulai seperti itu, biasanya masalahnya bukan lagi soal tim kurang teliti. Sistem kerjanya memang sudah terlalu sempit untuk beban operasional yang ada.",
    ],
    sections: [
      {
        heading: "1. Data pasien mulai tercecer di banyak tempat",
        paragraphs: [
          "Ini tanda yang paling sering dianggap sepele. Nama pasien ada di buku pendaftaran, nomor kontak ada di chat admin, riwayat layanan ada di map kertas, dan catatan pembayaran ada di file lain. Saat pasien datang lagi, staf harus menyambung informasi dari beberapa tempat sekaligus.",
          "Semakin sering itu terjadi, semakin besar risiko ada data yang tertinggal atau salah baca. Aplikasi manajemen klinik tidak otomatis membuat operasional jadi sempurna, tapi setidaknya semua tim bekerja dari sumber data yang sama.",
        ],
      },
      {
        heading: "2. Antrean dan jadwal mulai bikin staf kewalahan",
        paragraphs: [
          "Kalau klinik masih bisa tenang saat pasien harian sedikit, itu wajar. Tapi ketika jumlah kunjungan naik, cara manual cepat terasa rapuh. Admin harus menjawab pertanyaan pasien, mengatur antrean, mengecek dokter yang bertugas, sambil tetap mencatat layanan dengan rapi.",
          "Di titik ini, masalahnya bukan malas atau tidak sigap. Beban kerjanya memang sudah terlalu banyak untuk ditangani lewat catatan terpisah. Sistem antrean dan jadwal yang lebih tertata biasanya langsung mengurangi gesekan di meja depan.",
        ],
      },
      {
        heading: "3. Laporan harian selalu telat atau tidak benar-benar meyakinkan",
        paragraphs: [
          "Pemilik klinik biasanya ingin jawaban yang sederhana: hari ini ada berapa pasien, layanan apa yang paling sering dipakai, dan pendapatan masuk berapa. Yang sering terjadi justru sebaliknya. Tim perlu waktu lama untuk rekap, dan ketika hasilnya jadi, semua orang masih ragu apakah angkanya sudah akurat.",
          "Kalau laporan selalu tergantung rekap manual, klinik akan sulit mengambil keputusan cepat. Padahal keputusan operasional sering lahir dari data yang terlihat jelas, bukan dari tebakan.",
        ],
      },
      {
        heading: "4. Proses kasir dan billing makin sering bikin koreksi",
        paragraphs: [
          "Begitu layanan, tindakan, obat, dan pembayaran ditulis manual, potensi salah input ikut naik. Tidak harus sampai besar. Selisih kecil yang berulang justru lebih melelahkan karena terus mengganggu ritme kerja tim.",
          "Kalau staf mulai sering bilang, 'nanti saya cek dulu catatannya', itu biasanya sinyal bahwa alur billing sudah butuh sistem yang lebih rapi. Bukan supaya terlihat modern, tapi supaya pekerjaan dasar tidak terus-terusan diulang dua kali.",
        ],
      },
      {
        heading: "5. Pemilik klinik mulai sulit melihat gambaran operasional secara utuh",
        paragraphs: [
          "Saat klinik bertumbuh, tantangannya bukan cuma melayani pasien. Pemilik juga perlu melihat apakah operasionalnya sehat. Klinik ramai belum tentu efisien. Pendapatan naik belum tentu margin ikut bagus. Tanpa dashboard dan laporan yang mudah dibaca, keputusan biasanya terlalu bergantung pada perasaan.",
          "Di titik ini, software klinik bukan lagi alat tambahan. Ia mulai menjadi fondasi kerja, karena membantu pemilik dan tim melihat kondisi klinik dengan lebih jernih.",
        ],
      },
    ],
    closing: [
      "Tidak semua klinik harus langsung memakai sistem yang rumit. Yang lebih penting adalah menyadari kapan cara manual sudah mulai menghambat pelayanan, menambah beban staf, dan membuat keputusan jadi lambat.",
      "Kalau tanda-tanda di atas sudah mulai terasa, langkah berikutnya biasanya bukan menambah buku catatan baru. Yang lebih masuk akal justru merapikan alur kerja lewat aplikasi klinik yang memang dibuat untuk operasional harian.",
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
