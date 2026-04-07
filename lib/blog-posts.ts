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
    title: "5 Tanda Klinik Sudah Tidak Cocok Lagi Pakai Pencatatan Manual",
    description:
      "Tanda-tanda operasional klinik mulai kewalahan dengan pencatatan manual, dan kenapa aplikasi manajemen klinik mulai terasa perlu.",
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
  {
    slug: "kenapa-antrean-klinik-sering-kacau-di-jam-ramai",
    title: "Antrean Klinik Selalu Kacau Saat Ramai? Biasanya Bukan Karena Staf Kurang Cepat",
    description:
      "Kalau antrean klinik selalu kacau saat jam ramai, masalahnya sering ada di alur kerja, bukan di kecepatan staf.",
    publishedAt: "2026-04-07",
    readingTime: "5 menit baca",
    keywords: [
      "antrean klinik",
      "aplikasi antrean pasien",
      "operasional klinik",
      "software klinik",
    ],
    intro: [
      "Ada fase tertentu di klinik ketika semua orang merasa sedang bekerja cepat, tapi pasien tetap menunggu lama. Admin sibuk, dokter sudah mulai memanggil, kasir ikut menangani pertanyaan, namun suasana di meja depan tetap terasa kusut.",
      "Kalau itu sering terjadi di jam ramai, masalahnya biasanya bukan semata-mata jumlah staf. Sering kali justru alur antreannya yang tidak cukup jelas, sehingga energi tim habis untuk menutup celah kecil yang terus muncul berulang.",
      "Karena itu, memperbaiki antrean klinik tidak selalu dimulai dari menambah orang. Kadang yang lebih mendesak justru merapikan urutan kerja dan titik perpindahan informasinya.",
    ],
    sections: [
      {
        heading: "1. Meja pendaftaran jadi tempat semua pertanyaan menumpuk",
        paragraphs: [
          "Di banyak klinik, semua pertanyaan berhenti di admin depan. Pasien baru bertanya soal alur, pasien lama bertanya soal nomor antrean, keluarga pasien bertanya soal dokter yang bertugas, sementara di saat yang sama admin masih harus mencatat data dan menyiapkan berkas layanan.",
          "Kalau semuanya bercampur di satu titik, antrean mudah sekali melambat. Bukan karena admin tidak sigap, tetapi karena terlalu banyak keputusan kecil harus diambil di saat yang sama.",
        ],
      },
      {
        heading: "2. Nomor antrean ada, tapi status pasien tidak benar-benar terlihat",
        paragraphs: [
          "Sebagian klinik sudah memakai nomor antrean, tapi itu belum tentu cukup. Yang sering bikin kacau justru bukan nomor antreannya, melainkan tidak jelas pasien sedang berada di tahap mana: baru daftar, menunggu dokter, pindah ke tindakan, atau sudah ke kasir.",
          "Kalau status ini tidak terlihat dengan cepat, staf akan sering bertanya ulang dan pasien merasa dipanggil tidak sesuai urutan. Dari luar terlihat seolah-olah antrean berantakan, padahal masalah utamanya ada di visibilitas proses.",
        ],
      },
      {
        heading: "3. Jadwal dokter berubah sedikit, dampaknya ke antrean bisa panjang",
        paragraphs: [
          "Jam ramai biasanya sensitif terhadap perubahan kecil. Dokter datang sedikit mundur, satu tindakan memakan waktu lebih lama, atau ada pasien yang butuh penanganan tambahan. Kalau sistem antrean tidak cukup lentur, perubahan kecil ini langsung memicu antrean menumpuk di belakangnya.",
          "Yang paling melelahkan, staf harus menjelaskan ulang ke banyak pasien sambil tetap menjaga meja depan tetap berjalan. Ini sebabnya jadwal dan antrean sebaiknya tidak dipisahkan dalam praktik harian.",
        ],
      },
      {
        heading: "4. Pasien merasa menunggu tanpa kepastian",
        paragraphs: [
          "Menunggu lima belas menit dengan informasi yang jelas rasanya beda dengan menunggu lima belas menit tanpa tahu sedang menunggu apa. Banyak keluhan pasien sebenarnya lahir dari ketidakjelasan, bukan semata-mata dari lamanya durasi tunggu.",
          "Begitu informasi tidak bergerak, persepsi pasien langsung memburuk. Tim klinik akhirnya harus memadamkan emosi, padahal akar persoalannya ada di alur komunikasi yang kurang rapi.",
        ],
      },
      {
        heading: "5. Jam ramai menelanjangi kelemahan sistem kerja yang selama ini tertutup",
        paragraphs: [
          "Saat pasien sedikit, sistem manual masih terlihat aman. Begitu jam ramai datang, semua kelemahan kecil jadi terlihat: pencatatan dobel, informasi yang tercecer, panggilan yang loncat, sampai kasir yang baru menerima data saat pasien sudah berdiri di depan meja.",
          "Jam ramai sebenarnya bukan penyebab utama kekacauan. Ia hanya memperlihatkan bahwa alur kerja yang dipakai sekarang sudah tidak cukup kuat untuk menopang beban layanan yang ada.",
        ],
      },
    ],
    closing: [
      "Kalau antrean klinik sering kacau saat pasien ramai, tidak adil kalau semua beban langsung diarahkan ke staf depan. Sering kali mereka justru sedang menahan sistem yang dari awal belum tertata dengan baik.",
      "Karena itu, pembenahan antrean biasanya lebih efektif kalau dimulai dari cara data pasien, jadwal dokter, dan status layanan saling terhubung. Saat alurnya lebih jelas, kecepatan tim yang sebenarnya baru terasa hasilnya.",
    ],
  },
  {
    slug: "laporan-klinik-sering-tidak-cocok-saat-dicek-ulang",
    title: "Laporan Klinik Sering Tidak Cocok Saat Dicek Ulang? Biasanya Masalahnya Bukan Di Excel",
    description:
      "Kalau laporan klinik sering berubah saat diperiksa ulang, masalahnya sering ada di alur pencatatan harian yang tidak konsisten sejak awal.",
    publishedAt: "2026-04-07",
    readingTime: "6 menit baca",
    keywords: [
      "laporan klinik",
      "laporan operasional klinik",
      "software klinik",
      "manajemen klinik",
    ],
    intro: [
      "Banyak klinik baru merasa ada masalah saat laporan harian atau bulanan mulai sering tidak cocok. Angka kunjungan berubah setelah dicek ulang, total pembayaran berbeda dari catatan kasir, atau rekap layanan tidak sama dengan yang dibawa ke meja owner.",
      "Yang sering disalahkan pertama biasanya file rekapnya. Excel dianggap berantakan, rumusnya dianggap keliru, atau staf dianggap kurang teliti. Padahal, kalau dilihat lebih dekat, akar persoalannya sering muncul jauh sebelum data masuk ke file laporan.",
      "Laporan yang tidak stabil biasanya bukan tanda bahwa orangnya ceroboh. Sering kali itu tanda bahwa cara klinik mencatat aktivitas hariannya sudah terlalu longgar untuk menghasilkan angka yang benar-benar bisa dipegang.",
    ],
    sections: [
      {
        heading: "1. Data layanan masuk dari banyak jalur yang tidak selalu bertemu",
        paragraphs: [
          "Ada data dari meja pendaftaran, ada catatan dokter, ada transaksi kasir, ada tindakan tambahan, dan kadang ada perubahan yang disampaikan lisan. Selama semua itu belum bertemu di satu alur yang jelas, laporan akhir akan terus berisiko berubah.",
          "Ini sebabnya dua staf yang sama-sama rajin pun tetap bisa menghasilkan angka berbeda kalau sumber datanya memang tersebar sejak awal.",
        ],
      },
      {
        heading: "2. Koreksi kecil yang tidak dicatat langsung jadi sumber selisih",
        paragraphs: [
          "Dalam operasional klinik, koreksi kecil itu biasa. Layanan bisa berganti, item billing bisa dibatalkan, tindakan bisa ditambah, atau pasien bisa pindah jadwal. Masalah muncul ketika perubahan seperti itu tidak masuk ke catatan utama pada saat yang sama.",
          "Di akhir hari, tim hanya ingat bahwa tadi sempat ada revisi, tapi tidak semua revisi meninggalkan jejak yang rapi. Dari sinilah selisih mulai terasa saat laporan diperiksa ulang.",
        ],
      },
      {
        heading: "3. Owner meminta laporan yang cepat, tim masih mengandalkan rekap manual",
        paragraphs: [
          "Ini situasi yang sangat umum. Pemilik klinik ingin tahu kondisi hari ini secepat mungkin, sementara tim butuh waktu untuk menyatukan data dari beberapa tempat. Akhirnya laporan dikirim cepat dulu, lalu direvisi belakangan ketika ada angka yang ternyata belum masuk.",
          "Kalau pola ini terus terjadi, masalahnya bukan ada di orang yang membuat laporan. Sistem kerjanya memang belum memberi dasar data yang cukup siap saat dibutuhkan.",
        ],
      },
      {
        heading: "4. Laporan yang berubah-ubah membuat keputusan ikut goyah",
        paragraphs: [
          "Begitu angka sering berubah, kepercayaan terhadap laporan ikut turun. Owner jadi ragu memakai data untuk melihat performa dokter, menghitung pendapatan, atau memutuskan layanan mana yang perlu diperkuat. Semua terasa serba mungkin, tapi tidak ada yang benar-benar pasti.",
          "Dalam jangka panjang, ini lebih berbahaya daripada sekadar rekap yang lambat. Klinik kehilangan pijakan untuk mengambil keputusan dengan tenang.",
        ],
      },
      {
        heading: "5. Laporan yang rapi biasanya lahir dari pencatatan yang rapi, bukan dari rekap yang dipoles di belakang",
        paragraphs: [
          "Banyak orang berharap masalah laporan bisa selesai di tahap akhir, padahal kualitas laporan sangat bergantung pada cara data masuk sejak awal hari. Kalau pendaftaran, layanan, tindakan, dan pembayaran sudah saling terhubung, laporan biasanya ikut lebih stabil tanpa harus terlalu banyak dibetulkan di belakang.",
          "Karena itu, memperbaiki laporan klinik sering kali berarti memperbaiki alur operasionalnya, bukan sekadar mengganti format rekapnya.",
        ],
      },
    ],
    closing: [
      "Kalau laporan klinik sering tidak cocok saat dicek ulang, jangan buru-buru menyimpulkan bahwa masalahnya ada di file atau orang yang merekap. Sering kali laporan hanya sedang memperlihatkan bahwa alur pencatatan harian belum cukup rapat.",
      "Begitu data pasien, layanan, dan pembayaran tercatat lebih konsisten sejak awal, laporan biasanya ikut membaik dengan sendirinya. Di situlah angka mulai terasa lebih bisa dipercaya, bukan sekadar lebih rapi dilihat.",
    ],
  },
  {
    slug: "kenapa-data-pasien-sering-tidak-ketemu-saat-dibutuhkan",
    title: "Kenapa Data Pasien Sering Tidak Ketemu Saat Dibutuhkan? Biasanya Bukan Karena Staf Lupa",
    description:
      "Kalau data pasien sering sulit ditemukan saat dibutuhkan, masalahnya biasanya ada di cara klinik menyimpan dan memindahkan informasi, bukan semata-mata di ingatan staf.",
    publishedAt: "2026-04-07",
    readingTime: "5 menit baca",
    keywords: [
      "data pasien klinik",
      "rekam medis elektronik",
      "software klinik",
      "manajemen pasien klinik",
    ],
    intro: [
      "Ada momen yang cukup bikin panik di klinik: pasien datang, namanya dikenal, riwayatnya terasa pernah ada, tapi saat dicari datanya tidak langsung muncul. Admin mulai buka buku lama, chat lama, map lama, atau tanya ke staf lain yang kebetulan ingat.",
      "Dari luar situasinya terlihat seperti kelalaian kecil. Tapi kalau kejadian seperti ini berulang, biasanya masalahnya tidak sesederhana staf lupa menyimpan data. Yang bermasalah justru cara informasi itu bergerak dari satu meja ke meja lain.",
      "Itulah kenapa data pasien yang sering tidak ketemu biasanya bukan masalah orang per orang. Ia lebih sering jadi tanda bahwa sistem penyimpanannya memang belum cukup rapi untuk dipakai bersama.",
    ],
    sections: [
      {
        heading: "1. Data pasien tersebar di lebih dari satu tempat",
        paragraphs: [
          "Nama pasien mungkin ada di buku pendaftaran, nomor telepon tersimpan di WhatsApp admin, riwayat kunjungan ada di map fisik, sementara catatan pembayaran ada di tempat lain. Selama semua itu masih dianggap normal, pencarian data akan selalu bergantung pada siapa yang sedang jaga dan apa yang masih mereka ingat.",
          "Masalahnya, klinik tidak bisa terus berjalan dengan mengandalkan ingatan orang tertentu. Begitu orangnya tidak ada, proses pencarian ikut melambat.",
        ],
      },
      {
        heading: "2. Penulisan nama dan identitas tidak selalu konsisten",
        paragraphs: [
          "Hal kecil seperti perbedaan penulisan nama sering bikin data terasa hilang padahal sebenarnya ada. Ada pasien yang ditulis lengkap di satu tempat, dipanggil dengan nama singkat di tempat lain, atau nomor identitasnya tidak selalu dicatat pada format yang sama.",
          "Begitu standar input tidak konsisten, pencarian data jadi rawan buntu. Staf merasa datanya hilang, padahal sebenarnya tertutup oleh variasi pencatatan yang tidak pernah disamakan sejak awal.",
        ],
      },
      {
        heading: "3. Riwayat layanan tidak ikut berjalan bersama data pasien",
        paragraphs: [
          "Kadang data dasar pasien memang ketemu, tapi riwayat layanannya tidak ikut terbaca dengan utuh. Ini juga bentuk masalah yang sama. Informasi pasien ada, tapi konteks klinisnya tidak bergerak bersama. Akibatnya dokter atau admin tetap harus bertanya ulang hal-hal yang seharusnya sudah tercatat.",
          "Kalau riwayat pasien dan data inti tidak saling terhubung, klinik tetap akan merasa seperti bekerja setengah buta.",
        ],
      },
      {
        heading: "4. Saat klinik makin ramai, pencarian manual makin terasa melelahkan",
        paragraphs: [
          "Ketika jumlah pasien masih sedikit, mencari map atau catatan lama mungkin masih terasa biasa. Tapi begitu kunjungan meningkat, setiap pencarian tambahan ikut memakan energi staf. Waktu yang seharusnya dipakai untuk melayani pasien habis untuk mengejar informasi yang seharusnya bisa muncul lebih cepat.",
          "Di titik ini, kelambatan bukan cuma soal administrasi. Ia mulai berpengaruh ke pengalaman pasien dan ritme kerja tim secara keseluruhan.",
        ],
      },
      {
        heading: "5. Data yang mudah dicari biasanya lahir dari sistem yang dipakai bersama, bukan dari arsip yang rajin ditumpuk",
        paragraphs: [
          "Banyak klinik sebenarnya tidak kekurangan data. Yang kurang justru adalah tempat bersama yang membuat data itu mudah dicari, dibaca, dan dilanjutkan oleh tim lain tanpa harus mulai dari nol. Arsip yang lengkap tetap bisa terasa berantakan kalau tidak bisa diakses dengan alur yang jelas.",
          "Karena itu, masalah data pasien yang sering tidak ketemu biasanya selesai bukan dengan menambah map baru, tetapi dengan merapikan cara data masuk dan dibaca oleh seluruh tim.",
        ],
      },
    ],
    closing: [
      "Kalau data pasien sering sulit ditemukan saat dibutuhkan, jangan langsung menganggap tim kurang teliti. Sering kali mereka hanya sedang bekerja di atas sistem yang membuat pencarian data menjadi lebih rumit dari yang seharusnya.",
      "Begitu data pasien, identitas, dan riwayat layanan tercatat di tempat yang lebih konsisten, proses pencarian biasanya langsung terasa lebih ringan. Dari situ, layanan juga ikut terasa lebih tenang dan tidak terburu-buru.",
    ],
  },
  {
    slug: "klinik-terasa-sibuk-terus-tapi-owner-tetap-sulit-lihat-angkanya",
    title: "Klinik Terasa Sibuk Terus, Tapi Owner Tetap Sulit Lihat Angkanya? Biasanya Ini Penyebabnya",
    description:
      "Kalau klinik terasa ramai setiap hari tapi owner tetap sulit membaca angka operasionalnya, biasanya masalahnya ada di cara data dikumpulkan dan disajikan.",
    publishedAt: "2026-04-07",
    readingTime: "6 menit baca",
    keywords: [
      "owner klinik",
      "laporan operasional klinik",
      "dashboard klinik",
      "software klinik",
    ],
    intro: [
      "Dari luar, klinik terlihat sibuk. Pasien datang, antrean berjalan, kasir terus bekerja, dan ruang praktik tidak pernah benar-benar sepi. Tapi ketika owner ingin melihat angka hari itu, jawabannya sering masih kabur.",
      "Berapa pasien yang benar-benar datang? Layanan apa yang paling banyak dipakai? Pendapatan hari ini naik atau justru hanya terasa ramai di depan? Pertanyaan seperti ini sering terdengar sederhana, tapi jawabannya justru lama keluar atau berubah saat dicek ulang.",
      "Kalau situasi ini terus berulang, masalahnya biasanya bukan owner terlalu banyak bertanya. Yang bermasalah justru cara operasional klinik menerjemahkan aktivitas harian menjadi angka yang bisa dibaca dengan tenang.",
    ],
    sections: [
      {
        heading: "1. Aktivitas ramai belum tentu langsung berubah jadi data yang siap dibaca",
        paragraphs: [
          "Banyak klinik mengira kesibukan operasional otomatis akan terlihat di laporan. Kenyataannya tidak selalu begitu. Pasien yang datang, tindakan yang berjalan, dan pembayaran yang masuk masih harus melewati proses pencatatan yang rapi sebelum berubah menjadi data yang bisa dipakai owner.",
          "Kalau alur pencatatannya masih terpencar, yang terlihat hanya keramaiannya. Angkanya sendiri tetap samar.",
        ],
      },
      {
        heading: "2. Owner menerima angka, tapi tidak selalu menerima konteksnya",
        paragraphs: [
          "Kadang laporan memang ada, tetapi bentuknya belum membantu membaca keadaan. Ada total pasien dan total pendapatan, tapi tidak terlihat layanan mana yang bergerak, dokter mana yang paling padat, atau titik mana yang justru paling sering macet.",
          "Angka tanpa konteks sering membuat owner tetap harus menebak. Akhirnya laporan ada, tapi tidak cukup menolong untuk mengambil keputusan.",
        ],
      },
      {
        heading: "3. Klinik terlihat sibuk, tapi efisiensinya belum tentu bagus",
        paragraphs: [
          "Ini salah satu jebakan paling umum. Klinik yang ramai sering dianggap pasti berjalan sehat. Padahal bisa saja tim sedang bekerja sangat keras hanya untuk menutup proses yang belum rapi. Pasien datang banyak, tapi waktu tunggu panjang. Pembayaran masuk, tapi koreksi billing juga sering terjadi.",
          "Kalau owner hanya melihat kesibukan di lapangan tanpa dukungan angka yang jelas, kondisi seperti ini gampang terlewat.",
        ],
      },
      {
        heading: "4. Keputusan jadi terlalu bergantung pada perasaan dan cerita lisan",
        paragraphs: [
          "Saat data operasional tidak mudah dibaca, owner biasanya bergerak dari potongan cerita: laporan singkat dari admin, kesan dari dokter, atau pengamatan langsung di klinik. Semua itu tetap berguna, tapi tidak cukup kalau harus dipakai terus-menerus sebagai dasar keputusan.",
          "Lama-lama keputusan jadi terasa reaktif. Owner tahu ada masalah, tapi sulit menunjuk dengan pasti letaknya ada di mana.",
        ],
      },
      {
        heading: "5. Owner baru bisa melihat angka dengan jelas kalau data harian dicatat dalam alur yang utuh",
        paragraphs: [
          "Masalah ini jarang selesai hanya dengan meminta laporan lebih sering. Kalau data pasien, layanan, transaksi, dan jadwal masih berjalan sendiri-sendiri, owner tetap akan menerima gambaran yang setengah jadi.",
          "Yang biasanya membantu justru sistem yang membuat data harian masuk ke satu alur yang lebih utuh. Dari situ, owner tidak cuma melihat klinik sedang sibuk, tapi juga bisa melihat sibuknya menghasilkan apa.",
        ],
      },
    ],
    closing: [
      "Kalau klinik terasa sibuk terus tapi owner tetap sulit membaca angkanya, itu bukan hal kecil. Biasanya justru di situlah masalah operasional mulai tersembunyi lebih lama dari yang seharusnya.",
      "Begitu aktivitas harian bisa diterjemahkan menjadi data yang lebih jelas, owner akan lebih mudah melihat mana yang benar-benar tumbuh, mana yang hanya terlihat ramai, dan mana yang perlu segera dibenahi.",
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
