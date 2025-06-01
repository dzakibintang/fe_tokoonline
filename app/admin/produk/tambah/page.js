'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProdukForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const produkId = searchParams.get('id');

  const [form, setForm] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    stok: '',
    gambar: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch data produk untuk edit jika ada id
  useEffect(() => {
    if (!produkId) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/produk/${produkId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
         Accept: 'application/json'
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Produk tidak ditemukan');
        return res.json();
      })
      .then((data) => {
        setForm({
          nama: data.nama,
          deskripsi: data.deskripsi || '',
          harga: data.harga,
          stok: data.stok,
          gambar: null, // gambar baru
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [produkId]);

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === 'gambar') {
      setForm((prev) => ({ ...prev, gambar: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('nama', form.nama);
      formData.append('deskripsi', form.deskripsi);
      formData.append('harga', form.harga);
      formData.append('stok', form.stok);
      if (form.gambar) formData.append('gambar', form.gambar);

      const url = produkId
        ? `${process.env.NEXT_PUBLIC_API_URL}/produk/${produkId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/produk`;

      const method = produkId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
           Accept: 'application/json'
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Gagal menyimpan produk');
      }

      alert(produkId ? 'Produk berhasil diperbarui' : 'Produk berhasil ditambahkan');
      router.push('/admin/produk');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{produkId ? 'Edit Produk' : 'Tambah Produk'}</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Nama</label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Deskripsi</label>
          <textarea
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Harga</label>
          <input
            type="number"
            name="harga"
            value={form.harga}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
            min="0"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Stok</label>
          <input
            type="number"
            name="stok"
            value={form.stok}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-2 rounded"
            min="0"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Gambar (opsional)</label>
          <input type="file" name="gambar" accept="image/*" onChange={handleChange} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  );
}
