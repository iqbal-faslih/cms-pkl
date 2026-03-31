export default function ErrorPage({ error }) {
  console.log("❗ ROUTER ERROR:", error); // DEBUG
  return (
    <div style={{ padding: 40 }}>
      <h1>Oops! Terjadi kesalahan 😢</h1>
      <p>Halaman tidak ditemukan atau terjadi error.</p>
    </div>
  );
}
