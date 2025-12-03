'use client';

import Link from 'next/link';

export default function NavbarAdmin() {
  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <ul className="flex gap-6">
        <li>
          <Link href="/home_admin" className="hover:underline">
            Beranda
          </Link>
        </li>
        <li>
          <Link href="/admin/produk" className="hover:underline">
            Produk
          </Link>
        </li>
        <li>
          <Link href="/admin/transaksi" className="hover:underline">
            Transaksi
          </Link>
        </li>
        <li>
          <Link href="/admin/riwayat_transaksi" className="hover:underline">
            Riwayat Transaksi
          </Link>
        </li>
        <li>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
