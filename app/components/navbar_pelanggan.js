'use client';

import Link from 'next/link';

export default function NavbarPelanggan() {
  return (
    <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Home Pelanggan</h1>
      <ul className="flex gap-6">
        <li>
          <Link href="/home_pelanggan" className="hover:underline">
            Beranda
          </Link>
        </li>
        <li>
          <Link href="/pelanggan/produk" className="hover:underline">
            produk
          </Link>
        </li>
        <li>
          <Link href="/pelanggan/keranjang" className="hover:underline">
            Keranjang
          </Link>
        </li>
        <li>
          <Link href="/pelanggan/transaksi" className="hover:underline">
            Transaksi
          </Link>
        </li>
        <li>
          <Link href="/pelanggan/riwayat-transaksi" className="hover:underline">
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
