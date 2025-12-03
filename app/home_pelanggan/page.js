'use client';

import { useState, useEffect } from 'react';
import NavbarPelanggan from '../components/navbar_pelanggan';

export default function HomePelanggan() {
  const [produk, setProduk] = useState([]);
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
      } catch (err) {
        setError(err.message);
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

  // Fungsi untuk menambahkan produk ke keranjang dengan jumlah yang diinput
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/keranjang`, {
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
      setTimeout(() => setSuccess(''), 3000); // Pesan sukses hilang setelah 3 detik
    } catch (err) {
      setError('Terjadi kesalahan saat menambahkan ke keranjang');
    }
  }

  return (
    <>
      <NavbarPelanggan />
      <main className="home-pelanggan-container">
        <h1 className="dashboard-title">Dashboard Pelanggan</h1>
        <p className="welcome-message">Selamat datang, Pelanggan!</p>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="produk-grid">
          {produk.length > 0 ? (
            produk.map((item) => (
              <div key={item.id} className="produk-card">
                <img
                  src={
                    item.gambar
                      ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${item.gambar}`
                      : 'https://via.placeholder.com/150'
                  }
                  alt={item.nama}
                  className="produk-image"
                />
                <div className="produk-details">
                  <h2 className="produk-nama">{item.nama}</h2>
                  <p className="produk-harga">
                    Rp {Number(item.harga).toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                  </p>
                  <p className="produk-stok">
                    Stok: {item.stok > 0 ? item.stok : 'Habis'}
                  </p>
                  <button
                    className="add-to-cart-button"
                    onClick={() => openModal(item)}
                    disabled={item.stok <= 0}
                  >
                    {item.stok > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-products">Belum ada produk tersedia.</p>
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

      <style jsx>{`
        .home-pelanggan-container {
          padding: 2rem;
          background-color: #f5f5f5;
          min-height: calc(100vh - 64px); /* Mengurangi tinggi navbar */
        }

        .dashboard-title {
          font-size: 1.75rem;
          font-weight: bold;
          color: #333;
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .welcome-message {
          font-size: 1rem;
          color: #666;
          text-align: center;
          margin-bottom: 2rem;
        }

        .error-message {
          text-align: center;
          color: #dc3545;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .success-message {
          text-align: center;
          color: #28a745;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .produk-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          padding: 0 1rem;
        }

        .produk-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .produk-card:hover {
          transform: translateY(-5px);
        }

        .produk-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }

        .produk-details {
          padding: 1rem;
        }

        .produk-nama {
          font-size: 1.25rem;
          font-weight: bold;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .produk-harga {
          font-size: 1rem;
          color: #007bff;
          margin-bottom: 0.25rem;
        }

        .produk-stok {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.75rem;
        }

        .add-to-cart-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .add-to-cart-button:hover {
          background-color: #218838;
        }

        .add-to-cart-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        .no-products {
          text-align: center;
          font-size: 1rem;
          color: #666;
          margin-top: 2rem;
        }

        @media (max-width: 480px) {
          .home-pelanggan-container {
            padding: 1rem;
          }

          .produk-grid {
            grid-template-columns: 1fr;
            padding: 0;
          }
        }
      `}</style>
    </>
  );
}