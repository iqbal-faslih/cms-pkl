import React from "react";

export const LegalPages = ({ page }) => {
  switch (page) {
    case 'terms':
      return (
        <div className="prose max-w-none text-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Syarat & Ketentuan</h1>
          <p className="mb-6">
            Selamat datang di website kami. Dengan mengakses atau menggunakan website kami, Anda setuju untuk terikat oleh syarat dan ketentuan berikut. Harap baca dengan saksama sebelum menggunakan layanan kami.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">1. Penerimaan Syarat</h2>
          <p>
            Dengan menggunakan website ini, Anda mengakui bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan salah satu bagian dari syarat ini, Anda tidak diperkenankan menggunakan website kami.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">2. Perubahan Syarat</h2>
          <p>
            Kami berhak untuk mengubah, memodifikasi, menambah, atau menghapus bagian dari Syarat dan Ketentuan ini kapan saja. Perubahan akan berlaku segera setelah diposting di website. Tanggung jawab Anda meninjau Syarat dan Ketentuan ini secara berkala.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">3. Konten Pengguna</h2>
          <p>
            Setiap konten yang Anda kirimkan ke website, termasuk teks, gambar, atau data lainnya, dianggap sebagai milik Anda. Namun, dengan mengirimkan konten, Anda memberikan lisensi non-eksklusif, bebas royalti, dan dapat dialihkan kepada kami untuk menggunakan, mereproduksi, memodifikasi, dan mempublikasi konten tersebut.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">4. Batasan Tanggung Jawab</h2>
          <p>
            Kami tidak bertanggung jawab atas kerugian atau kerusakan yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan website kami. Layanan disediakan "apa adanya" tanpa jaminan dalam bentuk apapun, baik tersurat maupun tersirat.
          </p>
        </div>
      );
    case 'privacy':
      return (
        <div className="prose max-w-none text-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Kebijakan Privasi</h1>
          <p className="mb-6">
            Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat Anda menggunakan website kami. Privasi Anda sangat penting bagi kami.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">1. Informasi yang Kami Kumpulkan</h2>
          <p>
            Kami dapat mengumpulkan informasi pribadi yang Anda berikan secara langsung kepada kami, seperti nama, alamat email, dan nomer telepon. Kami juga dapat mengumpulkan data non-pribadi secara otomatis, seperti alamat IP dan jenis peramban Anda.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">2. Penggunaan Informasi</h2>
          <p>
            Informasi yang kami kumpulkan digunakan untuk:
          </p>
          <ul className="list-disc list-inside">
            <li>Menyediakan dan memelihara layanan kami.</li>
            <li>Meningkatkan pengalaman pengguna.</li>
            <li>Mengirim komunikasi pemasaran atau promosi (dengan persetujuan Anda).</li>
            <li>Menganalisis tren penggunaan dan perilaku pengguna.</li>
          </ul>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">3. Perlindungan Data</h2>
          <p>
            Kami menerapkan berbagai langkah keamanan untuk melindungi informasi pribadi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Meskipun demikian, tidak ada metode transmisi data melalui internet atau penyimpanan elektronik yang 100% aman.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">4. Pengungkapan kepada Pihak Ketiga</h2>
          <p>
            Kami tidak menjual, memperdagangkan, atau menyewakan informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali yang diizinkan oleh hukum atau untuk menyediakan layanan yang Anda minta.
          </p>
        </div>
      );
    default:
      return null;
  }
};