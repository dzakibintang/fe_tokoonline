import NavbarAdmin from '../components/navbar_admin';

export default function HomeAdmin() {
  return (
    <>
      <NavbarAdmin />
      <main className="p-4">
        <h1>Dashboard Admin</h1>
        <p>Selamat datang, Admin!</p>
      </main>
    </>
  );
}
