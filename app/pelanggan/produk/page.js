'use client';

import { useEffect, useState } from 'react';

export default function ProdukPage() {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProduk() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:8000/api/produk');
        if (!res.ok) throw new Error('Gagal mengambil data produk');
        const data = await res.json();
        setProdukList(data);
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    }
    fetchProduk();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Daftar Produk</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {produkList.length === 0 && (
          <p className="col-span-full text-center text-gray-500">Belum ada produk tersedia.</p>
        )}
        {produkList.map((produk) => (
          <div key={produk.id} className="border rounded p-4 shadow hover:shadow-lg transition">
            {produk.gambar ? (
              <img
                src={`http://localhost:8000/storage/${produk.gambar}`}
                alt={produk.nama}
                className="w-full h-48 object-cover rounded mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center text-gray-400">
                Tidak ada gambar
              </div>
            )}
            <h2 className="text-xl font-semibold">{produk.nama}</h2>
            <p className="text-gray-600 mb-2">{produk.deskripsi || '-'}</p>
            <p className="font-bold mb-2">Rp {produk.harga.toLocaleString('id-ID')}</p>
            <p className="text-sm text-gray-500">Stok: {produk.stok}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
