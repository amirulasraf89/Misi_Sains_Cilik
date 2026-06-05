import { useState, useEffect, useRef, useCallback } from 'react'
import './index.css'

// ── Question database ─────────────────────────────────────────────────────────
interface Question { s: string; img: string; j: string[]; b: number; n: string }

const db: Question[] = [
  // Unit 1 – Kemahiran Saintifik
  {s:"Deria rasa menggunakan...", img:"👅", j:["Hidung","Lidah","Telinga"], b:1, n:"Lidah kesan rasa."},
  {s:"Memerhati guna...", img:"👀", j:["Deria","Kaki","Rambut"], b:0, n:"Guna mata, telinga, dll."},
  {s:"Mengelas bermaksud...", img:"📂", j:["Asing & Kumpul","Buang","Makan"], b:0, n:"Asing ikut ciri."},
  {s:"Alat ukur piawai?", img:"📏", j:["Jengkal","Pembaris","Depa"], b:1, n:"Pembaris beri ukuran tepat."},
  {s:"Melakar mesti...", img:"✏️", j:["Tepat","Cantik","Warna"], b:0, n:"Lakar dengan tepat."},
  {s:"Bersihkan radas...", img:"🧼", j:["Selepas guna","Esok","Tak perlu"], b:0, n:"Cuci lepas guna."},
  {s:"Simpan radas di...", img:"🗄️", j:["Tempat asal","Beg","Lantai"], b:0, n:"Tempat selamat."},
  {s:"Kendalikan spesimen...", img:"🐌", j:["Cermat","Kasar","Main-main"], b:0, n:"Dengan cermat."},
  {s:"Komunikasi ialah...", img:"🗣️", j:["Sampaikan info","Tidur","Makan"], b:0, n:"Berkongsi maklumat."},
  {s:"Buang sisa cecair ke...", img:"🚰", j:["Sinki","Tong sampah","Lantai"], b:0, n:"Ke dalam sinki."},
  // Unit 2 – Keselamatan
  {s:"Buang sampah pepejal ke...", img:"🗑️", j:["Sinki","Tong sampah","Tingkap"], b:1, n:"Ke tong sampah."},
  {s:"Jika radas pecah...", img:"💥", j:["Lapor guru","Diamkan","Sorok"], b:0, n:"Beritahu guru."},
  {s:"Dilarang ___ di bilik sains.", img:"🍔", j:["Makan/Minum","Bernafas","Duduk"], b:0, n:"Jangan makan."},
  {s:"Masuk bilik sains...", img:"🚪", j:["Kebenaran guru","Senyap-senyap","Lari"], b:0, n:"Tunggu guru."},
  {s:"Beg sekolah letak di...", img:"🎒", j:["Luar/Rak","Atas meja","Lantai"], b:0, n:"Tempat beg."},
  {s:"Jangan ___ di dalam bilik.", img:"🏃", j:["Berlari","Belajar","Melihat"], b:0, n:"Jaga keselamatan."},
  {s:"Radas kotor perlu...", img:"🧽", j:["Dicuci","Dibuang","Disimpan"], b:0, n:"Cuci bersih."},
  {s:"Jika berlaku api...", img:"🔥", j:["Beritahu guru","Lari rumah","Nangis"], b:0, n:"Lapor guru."},
  {s:"Susun kerusi sebelum...", img:"🪑", j:["Keluar","Masuk","Tidur"], b:0, n:"Kemas sebelum keluar."},
  {s:"Bahan kimia dilarang...", img:"🧪", j:["Rasa/Hidu","Lihat","Pegang botol"], b:0, n:"Bahaya beracun."},
  // Unit 3 – Manusia
  {s:"Manusia membiak cara...", img:"🤰", j:["Melahirkan","Bertelur","Belah diri"], b:0, n:"Melahirkan anak."},
  {s:"Urutan: Bayi → ...", img:"👶", j:["Kanak-kanak","Remaja","Dewasa"], b:0, n:"Jadi kanak-kanak."},
  {s:"Urutan: Kanak-kanak → ...", img:"👦", j:["Remaja","Bayi","Tua"], b:0, n:"Jadi remaja."},
  {s:"Bila membesar, tinggi...", img:"📏", j:["Bertambah","Kurang","Sama"], b:0, n:"Makin tinggi."},
  {s:"Bila membesar, saiz...", img:"👕", j:["Bertambah","Kecil","Hilang"], b:0, n:"Makin besar."},
  {s:"Ciri diwarisi: Warna...", img:"👁️", j:["Iris mata","Kasut","Buku"], b:0, n:"Warna mata diwarisi."},
  {s:"Ciri diwarisi: Jenis...", img:"🦱", j:["Rambut","Basikal","Pen"], b:0, n:"Rambut diwarisi."},
  {s:"Ciri diwarisi: Warna...", img:"✋", j:["Kulit","Beg","Baju"], b:0, n:"Warna kulit."},
  {s:"Tumbesaran individu...", img:"👯", j:["Berbeza","Sama","Serupa"], b:0, n:"Setiap orang beza."},
  {s:"Anak warisi ciri...", img:"👨‍👩‍👧", j:["Ibu bapa","Kawan","Guru"], b:0, n:"Dari keturunan."},
  // Unit 4 – Haiwan
  {s:"Haiwan bertelur BANYAK?", img:"🐸", j:["Katak","Ayam","Burung"], b:0, n:"Katak & Ikan."},
  {s:"Haiwan bertelur SEDIKIT?", img:"🐔", j:["Ayam","Ikan","Katak"], b:0, n:"Ayam & Burung."},
  {s:"Haiwan lahir anak BANYAK?", img:"🐈", j:["Kucing","Gajah","Panda"], b:0, n:"Kucing & Arnab."},
  {s:"Haiwan lahir anak SEDIKIT?", img:"🐘", j:["Gajah","Tikus","Kucing"], b:0, n:"Gajah & Panda."},
  {s:"Anak SERUPA induk?", img:"🐄", j:["Lembu","Katak","Rama-rama"], b:0, n:"Anak lembu."},
  {s:"Anak TAK SERUPA induk?", img:"🦋", j:["Rama-rama","Lembu","Kambing"], b:0, n:"Beluncas."},
  {s:"Telur → Berudu → ...", img:"🥚", j:["Katak","Ikan","Buaya"], b:0, n:"Kitaran katak."},
  {s:"Telur → Beluncas → ...", img:"🐛", j:["Rama-rama","Lalat","Nyamuk"], b:0, n:"Kitaran rama-rama."},
  {s:"Telur → Jentik → ...", img:"🦟", j:["Nyamuk","Katak","Lalat"], b:0, n:"Kitaran nyamuk."},
  {s:"Panda membiak...", img:"🐼", j:["Melahirkan","Bertelur","Tunas"], b:0, n:"Melahirkan anak."},
  {s:"Tenggiling membiak...", img:"🐾", j:["Melahirkan","Bertelur","Spora"], b:0, n:"Melahirkan."},
  {s:"Kura-kura membiak...", img:"🐢", j:["Bertelur","Melahirkan","Tunas"], b:0, n:"Bertelur."},
  {s:"Anak rama-rama dipanggil...", img:"🐛", j:["Beluncas","Ulat","Cacing"], b:0, n:"Beluncas."},
  {s:"Anak katak dipanggil...", img:"🐸", j:["Berudu","Ikan","Jentik"], b:0, n:"Berudu."},
  {s:"Cicak bertelur...", img:"🦎", j:["Sedikit","Banyak","Ribuan"], b:0, n:"Sedikit."},
  // Unit 5 – Tumbuhan
  {s:"Keperluan bercambah?", img:"🌱", j:["Air, Udara, Suhu","Baja","Cahaya"], b:0, n:"Air, Udara, Suhu."},
  {s:"Tumbesaran perlu...", img:"☀️", j:["Cahaya & Air","Bateri","Pasir"], b:0, n:"Cahaya & Air."},
  {s:"Bila membesar, daun...", img:"🍃", j:["Bertambah","Kurang","Sama"], b:0, n:"Daun makin banyak."},
  {s:"Bila membesar, batang...", img:"🌳", j:["Membesar","Kecil","Putus"], b:0, n:"Lilitan bertambah."},
  {s:"Bila membesar, pokok...", img:"📏", j:["Tinggi","Rendah","Kecil"], b:0, n:"Makin tinggi."},
  {s:"Tumbuhan sumber ___ haiwan.", img:"🍏", j:["Makanan","Air","Cahaya"], b:0, n:"Sumber makanan."},
  {s:"Tumbuhan beri gas...", img:"💨", j:["Oksigen","Asap","Wap"], b:0, n:"Oksigen."},
  {s:"Tumbuhan ialah...", img:"🏡", j:["Habitat","Musuh","Hiasan"], b:0, n:"Tempat tinggal haiwan."},
  {s:"Urutan: Biji benih → ...", img:"🌿", j:["Anak pokok","Buah","Bunga"], b:0, n:"Jadi anak pokok."},
  {s:"Pokok layu jika kurang...", img:"🥀", j:["Air","Tanah","Pasu"], b:0, n:"Kurang air."},
  // Unit 6 – Terang & Gelap
  {s:"Sumber cahaya utama?", img:"☀️", j:["Matahari","Lampu","Bulan"], b:0, n:"Matahari."},
  {s:"Cahaya buatan?", img:"💡", j:["Lampu","Matahari","Bintang"], b:0, n:"Lampu & Api."},
  {s:"Bayang terjadi bila...", img:"👥", j:["Dihalang","Tembus","Pantul"], b:0, n:"Cahaya dihalang."},
  {s:"Objek legap...", img:"🧱", j:["Halang cahaya","Tembus","Jernih"], b:0, n:"Tiada cahaya tembus."},
  {s:"Kerja mudah bila...", img:"🔦", j:["Terang","Gelap","Malam"], b:0, n:"Keadaan terang."},
  {s:"Wayang kulit guna...", img:"🎭", j:["Bayang-bayang","Pantulan","Biasan"], b:0, n:"Bayang-bayang."},
  {s:"Objek lutsinar...", img:"🪟", j:["Tiada bayang","Bayang hitam","Gelap"], b:0, n:"Cahaya tembus."},
  {s:"Arah bayang...", img:"⬅️", j:["Bertentangan","Sama","Atas"], b:0, n:"Lawan arah cahaya."},
  {s:"Waktu malam perlu...", img:"🕯️", j:["Lampu","Kipas","Air"], b:0, n:"Sumber cahaya."},
  {s:"Saiz bayang besar jika...", img:"🔦", j:["Dekat cahaya","Jauh","Tinggi"], b:0, n:"Dekat sumber cahaya."},
  // Unit 7 – Elektrik
  {s:"Bekalkan tenaga elektrik?", img:"🔋", j:["Sel kering","Mentol","Suis"], b:0, n:"Bateri/Sel kering."},
  {s:"Keluarkan cahaya?", img:"💡", j:["Mentol","Suis","Wayar"], b:0, n:"Mentol."},
  {s:"Sambung/Putus litar?", img:"🔘", j:["Suis","Sel kering","Mentol"], b:0, n:"Suis."},
  {s:"Alirkan arus?", img:"➰", j:["Wayar","Mentol","Bateri"], b:0, n:"Wayar."},
  {s:"Mentol menyala jika suis...", img:"🟢", j:["Tertutup","Terbuka","Rosak"], b:0, n:"Litar lengkap."},
  {s:"Mentol padam jika suis...", img:"🔴", j:["Terbuka","Tertutup","Baru"], b:0, n:"Litar tak lengkap."},
  {s:"Konduktor ialah...", img:"⚡", j:["Alir arus","Halang arus","Penebat"], b:0, n:"Boleh alir elektrik."},
  {s:"Penebat ialah...", img:"🚫", j:["Halang arus","Alir arus","Logam"], b:0, n:"Tidak alir elektrik."},
  {s:"Contoh Konduktor?", img:"📎", j:["Paku besi","Kayu","Plastik"], b:0, n:"Besi alir elektrik."},
  {s:"Contoh Penebat?", img:"🧤", j:["Getah","Emas","Air"], b:0, n:"Getah halang arus."},
  {s:"Sudu logam ialah...", img:"🥄", j:["Konduktor","Penebat","Sumber"], b:0, n:"Logam konduktor."},
  {s:"Pemadam ialah...", img:"✏️", j:["Penebat","Konduktor","Bateri"], b:0, n:"Getah penebat."},
  {s:"Jika bateri lemah...", img:"📉", j:["Mentol malap","Mentol terang","Meletup"], b:0, n:"Kurang tenaga."},
  {s:"Simbol (+) pada bateri?", img:"➕", j:["Positif","Negatif","Salah"], b:0, n:"Terminal positif."},
  {s:"Wayar perlu dipasang...", img:"🔗", j:["Kemas","Longgar","Putus"], b:0, n:"Sambungan kemas."},
  // Unit 8 – Campuran
  {s:"Asing klip kertas & pasir?", img:"🧲", j:["Magnet","Turas","Ayak"], b:0, n:"Guna magnet."},
  {s:"Asing tepung & batu?", img:"🥘", j:["Ayak","Magnet","Apung"], b:0, n:"Mengayak."},
  {s:"Asing daun di air?", img:"🍂", j:["Apung","Magnet","Turas"], b:0, n:"Mengapung."},
  {s:"Asing lumpur & air?", img:"💧", j:["Turas","Magnet","Ayak"], b:0, n:"Menuras."},
  {s:"Larut cepat jika air...", img:"☕", j:["Panas","Sejuk","Ais"], b:0, n:"Air panas."},
  {s:"Larut cepat jika...", img:"🥄", j:["Diaduk","Dibiarkan","Tidur"], b:0, n:"Kacau/Aduk."},
  {s:"Saiz bahan larut cepat?", img:"🧂", j:["Halus","Besar","Ketul"], b:0, n:"Saiz kecil."},
  {s:"Menyisih untuk...", img:"🤏", j:["Bahan besar","Cecair","Halus"], b:0, n:"Kutip satu-satu."},
  {s:"Gula larut dalam...", img:"🥤", j:["Air","Minyak","Batu"], b:0, n:"Air pelarut."},
  {s:"Batu dalam air akan...", img:"🪨", j:["Tenggelam","Terapung","Larut"], b:0, n:"Tenggelam."},
  // Unit 9 – Bumi
  {s:"Sumber air semulajadi?", img:"🌧️", j:["Hujan","Paip","Tangki"], b:0, n:"Hujan/Sungai."},
  {s:"Air mengalir dari...", img:"↘️", j:["Tinggi ke rendah","Rendah ke tinggi","Atas"], b:0, n:"Tinggi ke rendah."},
  {s:"Udara bergerak ialah...", img:"🌬️", j:["Angin","Wap","Gas"], b:0, n:"Angin."},
  {s:"Gas untuk bernafas?", img:"🫁", j:["Oksigen","Asap","Warna"], b:0, n:"Oksigen."},
  {s:"Kebaikan angin?", img:"⛵", j:["Gerak kapal layar","Roboh rumah","Banjir"], b:0, n:"Gerakkan layar."},
  {s:"Keburukan angin kencang?", img:"🌊", j:["Ombak besar","Nyaman","Sejuk"], b:0, n:"Bahaya/Kerosakan."},
  {s:"Wap air menjadi...", img:"☁️", j:["Awan","Batu","Tanah"], b:0, n:"Awan."},
  {s:"Sungai mengalir ke...", img:"🌊", j:["Laut","Bukit","Langit"], b:0, n:"Ke laut."},
  {s:"Hujan turun dari...", img:"🌨️", j:["Awan","Bulan","Matahari"], b:0, n:"Awan."},
  {s:"Perlu udara untuk...", img:"🧘", j:["Bernafas","Makan","Mandi"], b:0, n:"Bernafas."},
  // Unit 10 – Teknologi
  {s:"Pasang set binaan rujuk...", img:"📖", j:["Manual","Buku cerita","TV"], b:0, n:"Manual bergambar."},
  {s:"Set binaan ada pelbagai...", img:"🟥", j:["Bentuk/Warna","Rasa","Bunyi"], b:0, n:"Bentuk & Warna."},
  {s:"Bentuk komponen?", img:"🧊", j:["Kiub/Prisma","Kertas","Kain"], b:0, n:"Kiub, Prisma."},
  {s:"Jika komponen hilang?", img:"🧩", j:["Tak lengkap","Siap","Cantik"], b:0, n:"Model tak siap."},
  {s:"Simpan komponen di...", img:"📦", j:["Kotak set","Beg","Lantai"], b:0, n:"Kotak asal."},
  {s:"Lepas guna, perlu...", img:"🛠️", j:["Buka & Simpan","Buang","Biarkan"], b:0, n:"Buka dulu."},
  {s:"Manual ialah...", img:"📄", j:["Panduan pasang","Cerita","Lagu"], b:0, n:"Panduan."},
  {s:"Boleh bina model lain?", img:"🏰", j:["Boleh","Tidak","Salah"], b:0, n:"Ikut kreativiti."},
  {s:"Pastikan komponen...", img:"✅", j:["Cukup","Kurang","Rosak"], b:0, n:"Mencukupi."},
  {s:"Jaga komponen dengan...", img:"❤️", j:["Cermat","Kasar","Pijak"], b:0, n:"Cermat."},
]

const TOTAL_QUESTIONS = 15
const TIMER_DURATION = 100 // percent units, ticks down over 20s
const TICK_MS = 200 // tick every 200ms → 20s total

type Screen = 'start' | 'game' | 'end'
type AnswerState = 'idle' | 'correct' | 'wrong' | 'timeout'

interface ShuffledOption { text: string; isCorrect: boolean }

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

// ── Start Screen ──────────────────────────────────────────────────────────────
function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-400 to-indigo-500 px-4 py-10">
      <div className="animate-float text-8xl mb-4 select-none">👨‍🚀</div>
      <h1 className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg text-center mb-2">
        Misi Sains Cilik
      </h1>
      <p className="text-sky-100 text-lg mb-2 text-center font-semibold">Sains Tahun 2 — Edisi Visual</p>
      <p className="text-sky-200 text-sm mb-10 text-center">100 Soalan Bergambar!</p>

      {/* Stars decoration */}
      <div className="flex gap-2 mb-8 text-3xl select-none">
        {['⭐','🌟','⭐','🌟','⭐'].map((s, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.3}s` }} className="animate-float">{s}</span>
        ))}
      </div>

      {/* Info cards */}
      <div className="flex gap-3 mb-10 flex-wrap justify-center">
        {[
          { icon: '🎯', label: '15 Soalan' },
          { icon: '❤️', label: '3 Nyawa' },
          { icon: '⏱️', label: '20 Saat' },
        ].map(({ icon, label }) => (
          <div key={label} className="bg-white/20 backdrop-blur rounded-2xl px-5 py-3 text-center text-white font-bold shadow">
            <div className="text-2xl">{icon}</div>
            <div className="text-sm mt-1">{label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        className="bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-yellow-900 font-black text-2xl px-14 py-4 rounded-full shadow-xl shadow-yellow-500/40 transition-all"
      >
        🚀 MULA!
      </button>
    </div>
  )
}

// ── End Screen ────────────────────────────────────────────────────────────────
function EndScreen({ score, onReplay }: { score: number; onReplay: () => void }) {
  const icon = score > 150 ? '🚀' : score > 100 ? '🌟' : '📚'
  const msg = score > 150 ? 'Luar Biasa!' : score > 100 ? 'Bagus Sekali!' : 'Cuba Lagi!'
  const color = score > 150 ? 'from-yellow-400 to-orange-400' : score > 100 ? 'from-indigo-400 to-purple-500' : 'from-sky-400 to-blue-500'

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-b ${color} px-4 py-10`}>
      <div className="animate-star-pop text-8xl mb-4 select-none">{icon}</div>
      <h1 className="text-4xl font-black text-white drop-shadow mb-1">Misi Selesai!</h1>
      <p className="text-white/80 text-xl font-bold mb-6">{msg}</p>

      <div className="bg-white/20 backdrop-blur rounded-3xl px-14 py-8 mb-10 text-center shadow-xl">
        <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-1">Markah Akhir</p>
        <p className="text-7xl font-black text-white drop-shadow">{score}</p>
      </div>

      <button
        onClick={onReplay}
        className="bg-white hover:bg-yellow-50 active:scale-95 text-indigo-700 font-black text-xl px-12 py-4 rounded-full shadow-xl transition-all"
      >
        🔄 Main Lagi!
      </button>
    </div>
  )
}

// ── Game Screen ───────────────────────────────────────────────────────────────
function GameScreen({
  question,
  questionNum,
  score,
  lives,
  timerPct,
  options,
  answerState,
  feedback,
  onAnswer,
}: {
  question: Question
  questionNum: number
  score: number
  lives: number
  timerPct: number
  options: ShuffledOption[]
  answerState: AnswerState
  feedback: string
  onAnswer: (opt: ShuffledOption) => void
}) {
  const timerColor =
    timerPct > 50 ? 'bg-emerald-400' : timerPct > 25 ? 'bg-yellow-400' : 'bg-red-400'

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-sky-100 flex items-center justify-center px-3 py-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-indigo-200 overflow-hidden">

        {/* Header bar */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={`text-xl transition-all ${i < lives ? 'opacity-100' : 'opacity-20'}`}>❤️</span>
            ))}
          </div>
          <span className="text-white/80 text-sm font-semibold">{questionNum} / {TOTAL_QUESTIONS}</span>
          <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
            <span className="text-yellow-300 text-lg">⭐</span>
            <span className="text-white font-black text-base">{score}</span>
          </div>
        </div>

        {/* Timer bar */}
        <div className="h-2.5 bg-slate-100">
          <div
            className={`h-full ${timerColor} transition-all duration-200 ease-linear`}
            style={{ width: `${timerPct}%` }}
          />
        </div>

        {/* Emoji visual */}
        <div className="flex items-center justify-center py-5 bg-gradient-to-b from-indigo-50 to-white">
          <span
            key={question.s}
            className="text-7xl select-none animate-pop-in leading-none"
          >
            {question.img}
          </span>
        </div>

        {/* Question */}
        <div className="px-5 pb-3">
          <p
            key={question.s + 'q'}
            className="text-center text-lg font-bold text-slate-800 animate-slide-up min-h-[3rem] flex items-center justify-center"
          >
            {question.s}
          </p>
        </div>

        {/* Options */}
        <div className="px-4 pb-2 flex flex-col gap-2.5">
          {options.map((opt, i) => {
            let btnClass =
              'w-full py-3.5 px-5 rounded-2xl text-left font-bold text-base transition-all border-2 '
            if (answerState === 'idle') {
              btnClass += 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 active:scale-98'
            } else if (opt.isCorrect) {
              btnClass += 'bg-emerald-100 border-emerald-400 text-emerald-800 animate-pulse-scale'
            } else {
              btnClass += 'bg-red-50 border-red-200 text-red-400 animate-shake'
            }

            return (
              <button
                key={i}
                onClick={() => answerState === 'idle' && onAnswer(opt)}
                disabled={answerState !== 'idle'}
                className={btnClass}
              >
                <span className="mr-2 text-slate-400 font-black text-sm">
                  {['A','B','C'][i]}.
                </span>
                {opt.text}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        <div className="px-5 pt-1 pb-5 min-h-[3rem] flex items-center justify-center">
          {feedback && (
            <p className={`text-sm font-bold text-center rounded-xl px-4 py-2 animate-slide-up ${
              answerState === 'correct'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-600'
            }`}>
              {answerState === 'correct' ? '✅ ' : '❌ '}{feedback}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [timerPct, setTimerPct] = useState(TIMER_DURATION)
  const [options, setOptions] = useState<ShuffledOption[]>([])
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [feedback, setFeedback] = useState('')

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerPctRef = useRef(TIMER_DURATION)

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const loadQuestion = useCallback((idx: number, qs: Question[]) => {
    if (idx >= TOTAL_QUESTIONS) {
      setScreen('end')
      return
    }
    const q = qs[idx]
    const shuffled = shuffle(
      q.j.map((text, i) => ({ text, isCorrect: i === q.b }))
    )
    setOptions(shuffled)
    setAnswerState('idle')
    setFeedback('')
    timerPctRef.current = TIMER_DURATION
    setTimerPct(TIMER_DURATION)

    stopTimer()
    timerRef.current = setInterval(() => {
      timerPctRef.current -= (TIMER_DURATION / (20000 / TICK_MS))
      setTimerPct(Math.max(0, timerPctRef.current))
      if (timerPctRef.current <= 0) {
        stopTimer()
        setAnswerState('timeout')
        setFeedback('⏰ Masa Tamat!')
        setLives(l => l - 1)
        setTimeout(() => setCurrentIdx(i => i + 1), 1800)
      }
    }, TICK_MS)
  }, [stopTimer])

  useEffect(() => {
    if (screen === 'game' && questions.length > 0) {
      loadQuestion(currentIdx, questions)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, questions])

  useEffect(() => {
    if (lives <= 0 && screen === 'game') {
      stopTimer()
      setTimeout(() => setScreen('end'), 500)
    }
  }, [lives, screen, stopTimer])

  useEffect(() => () => stopTimer(), [stopTimer])

  const handleStart = () => {
    const qs = shuffle(db).slice(0, TOTAL_QUESTIONS)
    setQuestions(qs)
    setCurrentIdx(0)
    setScore(0)
    setLives(3)
    setScreen('game')
  }

  const handleAnswer = (opt: ShuffledOption) => {
    stopTimer()
    if (opt.isCorrect) {
      const bonus = Math.ceil(timerPctRef.current / 10)
      setScore(s => s + 10 + bonus)
      setAnswerState('correct')
      setFeedback(questions[currentIdx].n)
    } else {
      setLives(l => l - 1)
      setAnswerState('wrong')
      setFeedback(questions[currentIdx].n)
    }
    setTimeout(() => setCurrentIdx(i => i + 1), 2000)
  }

  if (screen === 'start') return <StartScreen onStart={handleStart} />
  if (screen === 'end') return <EndScreen score={score} onReplay={handleStart} />

  return (
    <GameScreen
      question={questions[currentIdx]}
      questionNum={currentIdx + 1}
      score={score}
      lives={lives}
      timerPct={timerPct}
      options={options}
      answerState={answerState}
      feedback={feedback}
      onAnswer={handleAnswer}
    />
  )
}
