'use client';

import { useState, useEffect } from 'react';
import NavbarPelanggan from '../../../components/navbar_pelanggan';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function DetailProduk() {
  const { id } = useParams();
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduk() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Silakan login terlebih dahulu');
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:8000/api/produk/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Gagal mengambil detail produk');
        }

        const data = await res.json();
        setProduk(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchProduk();
  }, [id]);

  if (loading) return <div className="p-4 text-center text-black">Memuat...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;
  if (!produk) return <div className="p-4 text-center text-black">Produk tidak ditemukan.</div>;

  return (
    <>
      <NavbarPelanggan />
      <main className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-black mb-6">Detail Produk</h1>
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <img
            src={
              produk.gambar
                ? `http://localhost:8000/storage/${produk.gambar}`
                : 'https://via.placeholder.com/400x300'
            }
            alt={produk.nama}
            className="w-full h-64 object-cover rounded-md mb-6"
          />
          <h2 className="text-2xl font-semibold text-black mb-4">{produk.nama}</h2>
          <p className="text-black mb-4">
            <strong>Deskripsi:</strong> {produk.deskripsi || 'Tidak ada deskripsi.'}
          </p>
          <p className="text-black mb-4">
            <strong>Harga:</strong> Rp {Number(produk.harga).toLocaleString('id-ID', { minimumFractionDigits: 0 })}
          </p>
          <p className="text-black mb-6">
            <strong>Stok:</strong> {produk.stok > 0 ? produk.stok : 'Habis'}
          </p>
          <Link
            href="/pelanggan/produk"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Kembali
          </Link>
        </div>
      </main>
    </>
  );
}