'use client';

import { useState, useEffect } from 'react';
import NavbarAdmin from '../../components/navbar_admin';
import Link from 'next/link';

export default function ProdukAdmin() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    stok: '',
    gambar: null,
  });

  // Ambil data produk saat komponen dimuat
  useEffect(() => {
    async function fetchProduk() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Silakan login terlebih dahulu');
          setLoading(false);
          return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produk`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Gagal mengambil data produk');
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
  }, []);

  // Fungsi untuk membuka modal dan mengisi data produk yang akan diupdate
  const openModal = (produk) => {
    setSelectedProduk(produk);
    setFormData({
      nama: produk.nama,
      deskripsi: produk.deskripsi || '',
      harga: produk.harga.toString(),
      stok: produk.stok.toString(),
      gambar: null,
    });
    setModalOpen(true);
  };

  // Fungsi untuk menangani perubahan input form
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'gambar') {
      setFormData({ ...formData, gambar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Fungsi untuk menyimpan perubahan produk
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('nama', formData.nama);
      formDataToSend.append('deskripsi', formData.deskripsi);
      formDataToSend.append('harga', formData.harga);
      formDataToSend.append('stok', formData.stok);
      if (formData.gambar) {
        formDataToSend.append('gambar', formData.gambar);
      }
      formDataToSend.append('_method', 'PUT'); // Laravel memerlukan ini untuk PUT dengan form-data

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produk/${selectedProduk.id}`, {
        method: 'POST', // Menggunakan POST karena form-data dengan PUT sering bermasalah
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Gagal memperbarui produk');
      }

      const updatedProduk = await res.json();
      setProduk(
        produk.map((item) =>
          item.id === selectedProduk.id ? updatedProduk.produk : item
        )
      );
      setSuccess('Produk berhasil diperbarui!');
      setModalOpen(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  // Fungsi untuk menghapus produk
  const handleDelete = async (produkId) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/produk/${produkId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Gagal menghapus produk');
        }

        setProduk(produk.filter((item) => item.id !== produkId));
        setSuccess('Produk berhasil dihapus!');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError(err.message);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  if (loading) return <div className="p-4 text-center text-black">Memuat...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <>
      <NavbarAdmin />
      <main className="p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Kelola Produk</h1>
          <Link
            href="/admin/produk/tambah"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Tambah Produk
          </Link>
        </div>

        {success && <div className="p-4 mb-4 bg-green-100 text-green-700 rounded">{success}</div>}
        {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produk.length > 0 ? (
            produk.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <img
                  src={
                    item.gambar
                      ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${item.gambar}`
                      : 'https://via.placeholder.com/300x200'
                  }
                  alt={item.nama}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold text-black mb-2">{item.nama}</h2>
                <p className="text-black mb-2">Rp {Number(item.harga).toLocaleString('id-ID', { minimumFractionDigits: 0 })}</p>
                <p className="text-black mb-4">Stok: {item.stok}</p>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/produk/${item.id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Detail
                  </Link>
                  <button
                    onClick={() => openModal(item)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-black text-center col-span-full">Belum ada produk tersedia.</p>
          )}
        </div>

        {/* Modal untuk Update Produk */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-black mb-4">Update Produk</h2>
              <form onSubmit={handleUpdate}>
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
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}