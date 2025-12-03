'use client';

import { useState } from 'react';
import NavbarAdmin from '../../../components/navbar_admin';
import Link from 'next/link';

export default function TambahProduk() {
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    stok: '',
    gambar: null,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fungsi untuk menangani perubahan input form
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'gambar') {
      setFormData({ ...formData, gambar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Fungsi untuk menambahkan produk
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Silakan login terlebih dahulu');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('nama', formData.nama);
      formDataToSend.append('deskripsi', formData.deskripsi);
      formDataToSend.append('harga', formData.harga);
      formDataToSend.append('stok', formData.stok);
      if (formData.gambar) {
        formDataToSend.append('gambar', formData.gambar);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal menambahkan produk');
      }

      setSuccess('Produk berhasil ditambahkan!');
      setTimeout(() => {
        setSuccess(null);
        window.location.href = '/admin/produk';
      }, 2000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <>
      <NavbarAdmin />
      <main className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Tambah Produk Baru</h1>
          <Link
            href="/admin/produk"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Kembali
          </Link>
        </div>

        {success && <div className="p-4 mb-4 bg-green-100 text-green-700 rounded">{success}</div>}
        {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}

        <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-black mb-2">Nama Produk</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-black mb-2">Deskripsi</label>
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-black"
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-black mb-2">Harga</label>
              <input
                type="number"
                name="harga"
                value={formData.harga}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-black mb-2">Stok</label>
              <input
                type="number"
                name="stok"
                value={formData.stok}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-black mb-2">Gambar (opsional)</label>
              <input
                type="file"
                name="gambar"
                accept="image/*"
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-black"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
            >
              Tambah
            </button>
          </form>
        </div>
      </main>
    </>
  );
}