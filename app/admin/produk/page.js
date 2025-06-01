'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProdukAdminPage() {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchProduk() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produk`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // jika pakai token
        },
      });
      if (!res.ok) throw new Error('Gagal mengambil data produk');
      const data = await res.json();
      setProdukList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProduk();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produk/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // token auth
        },
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menghapus produk');
      }
      alert('Produk berhasil dihapus');
      fetchProduk(); // refresh list
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin - Daftar Produk</h1>

      <Link href="/admin/produk/tambah" className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        + Tambah Produk
      </Link>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Nama</th>
            <th className="border border-gray-300 p-2">Harga</th>
            <th className="border border-gray-300 p-2">Stok</th>
            <th className="border border-gray-300 p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {produkList.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                Belum ada produk.
              </td>
            </tr>
          )}
          {produkList.map((produk) => (
            <tr key={produk.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{produk.nama}</td>
              <td className="border border-gray-300 p-2">Rp {produk.harga.toLocaleString('id-ID')}</td>
              <td className="border border-gray-300 p-2">{produk.stok}</td>
              <td className="border border-gray-300 p-2 space-x-2">
                <Link
                  href={`/admin/produk/tambah?id=${produk.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(produk.id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
