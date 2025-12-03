'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavbarPelanggan from '../../components/navbar_pelanggan';

export default function ProdukPelanggan() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true); // Tambahkan state loading
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState(null);
  const [jumlah, setJumlah] = useState(1);

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

        const res = await fetch('http://localhost:8000/api/produk', {
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

  // Fungsi untuk membuka modal dan memilih produk
  const openModal = (produk) => {
    setSelectedProduk(produk);
    setJumlah(1); // Reset jumlah ke 1 saat modal dibuka
    setModalOpen(true);
  };

  // Fungsi untuk menambahkan produk ke keranjang
  async function tambahKeKeranjang() {
    if (!selectedProduk || !jumlah || jumlah <= 0) {
      setError('Masukkan jumlah yang valid');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Silakan login terlebih dahulu');
        return;
      }

      const res = await fetch('http://localhost:8000/api/keranjang', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          produk_id: selectedProduk.id,
          jumlah: jumlah,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal menambahkan ke keranjang');
        return;
      }

      setSuccess('Produk berhasil ditambahkan ke keranjang!');
      setModalOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Terjadi kesalahan saat menambahkan ke keranjang');
    }
  }

  if (loading) return <div className="p-4 text-center text-black">Memuat...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <>
      <NavbarPelanggan />
      <main className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-black mb-6">Daftar Produk</h1>

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
                      ? `http://localhost:8000/storage/${item.gambar}`
                      : 'https://via.placeholder.com/300x200'
                  }
                  alt={item.nama}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold text-black mb-2">{item.nama}</h2>
                <p className="text-black mb-2">Rp {Number(item.harga).toLocaleString('id-ID', { minimumFractionDigits: 0 })}</p>
                <p className="text-black mb-4">Stok: {item.stok > 0 ? item.stok : 'Habis'}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(item)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    disabled={item.stok <= 0}
                  >
                    {item.stok > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
                  </button>
                  <Link
                    href={`/pelanggan/produk/${item.id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-black text-center col-span-full">Belum ada produk tersedia.</p>
          )}
        </div>

        {/* Modal untuk Input Jumlah */}
        {modalOpen && selectedProduk && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-black mb-4">Tambah ke Keranjang</h2>
              <div className="mb-4">
                <p className="text-black mb-2">
                  <strong>Produk:</strong> {selectedProduk.nama}
                </p>
                <p className="text-black mb-2">
                  <strong>Harga:</strong> Rp {Number(selectedProduk.harga).toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                </p>
                <p className="text-black mb-2">
                  <strong>Stok Tersedia:</strong> {selectedProduk.stok}
                </p>
                <label className="block text-black mb-2">Jumlah</label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduk.stok}
                  value={jumlah}
                  onChange={(e) => setJumlah(Math.min(Math.max(1, e.target.value), selectedProduk.stok))}
                  className="w-full p-2 border rounded text-black"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={tambahKeKeranjang}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  disabled={jumlah > selectedProduk.stok}
                >
                  Tambah
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}