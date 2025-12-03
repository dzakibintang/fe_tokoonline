'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavbarPelanggan from '../../components/navbar_pelanggan';

export default function KeranjangPelanggan() {
  const [keranjang, setKeranjang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Ambil data keranjang saat komponen dimuat
  useEffect(() => {
    async function fetchKeranjang() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Silakan login terlebih dahulu');
          setLoading(false);
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/keranjang`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Gagal mengambil data keranjang');
        }

        const data = await res.json();
        setKeranjang(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchKeranjang();
  }, []);

  if (loading) return <div className="p-4 text-center text-black">Memuat...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  // Hitung total harga
  const totalHarga = keranjang.reduce((total, item) => {
    return total + (item.produk?.harga * item.jumlah || 0);
  }, 0);

  return (
    <>
      <NavbarPelanggan />
      <main className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-black mb-6">Keranjang Belanja</h1>

        {success && <div className="p-4 mb-4 bg-green-100 text-green-700 rounded">{success}</div>}
        {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}

        {keranjang.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-md mb-6">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="p-3 text-left">Produk</th>
                    <th className="p-3 text-left">Harga</th>
                    <th className="p-3 text-left">Jumlah</th>
                    <th className="p-3 text-left">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {keranjang.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-black">{item.produk?.nama || 'Produk Tidak Ditemukan'}</td>
                      <td className="p-3 text-black">Rp {Number(item.produk?.harga || 0).toLocaleString('id-ID', { minimumFractionDigits: 0 })}</td>
                      <td className="p-3 text-black">{item.jumlah}</td>
                      <td className="p-3 text-black">Rp {Number(item.produk?.harga * item.jumlah || 0).toLocaleString('id-ID', { minimumFractionDigits: 0 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
              <p className="text-black mb-4">
                <strong>Total Harga:</strong> Rp {Number(totalHarga).toLocaleString('id-ID', { minimumFractionDigits: 0 })}
              </p>
              <Link
                href="/pelanggan/pembayaran"
                className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 w-full text-center block"
              >
                Checkout
              </Link>
            </div>
          </>
        ) : (
          <p className="text-black text-center">Keranjang Anda kosong.</p>
        )}
      </main>
    </>
  );
}