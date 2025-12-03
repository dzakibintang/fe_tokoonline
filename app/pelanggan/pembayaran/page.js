'use client';

import { useState, useEffect } from 'react';
import NavbarPelanggan from '../../components/navbar_pelanggan';

export default function Pembayaran() {
  const [metodePembayaran, setMetodePembayaran] = useState('');
  const [buktiPembayaran, setBuktiPembayaran] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [pendingTransaction, setPendingTransaction] = useState(false);

  // Cek apakah ada transaksi yang sedang menunggu
  useEffect(() => {
    async function checkPendingTransaction() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Silakan login terlebih dahulu');
          setLoading(false);
          return;
        }

        const res = await fetch('http://localhost:8000/api/transaksi/saya', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Gagal memeriksa transaksi');
        }

        const data = await res.json();
        const hasPending = data.some((transaksi) => transaksi.status === 'menunggu');
        setPendingTransaction(hasPending);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    checkPendingTransaction();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!metodePembayaran || !buktiPembayaran) {
      setError('Semua field harus diisi');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('metode_pembayaran', metodePembayaran);
      formData.append('bukti_pembayaran', buktiPembayaran);

      const res = await fetch('http://localhost:8000/api/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Gagal melakukan checkout');
        return;
      }

      setSuccess('Checkout berhasil, menunggu verifikasi!');
      setPendingTransaction(true); // Set status pending setelah checkout berhasil
      setTimeout(() => {
        window.location.href = '/pelanggan/transaksi';
      }, 3000);
    } catch (err) {
      setError('Terjadi kesalahan saat checkout');
    }
  };

  if (loading) return <div className="p-4 text-center text-black">Memuat...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <>
      <NavbarPelanggan />
      <main className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-black mb-6">Pembayaran</h1>
        {success && <div className="p-4 mb-4 bg-green-100 text-green-700 rounded">{success}</div>}
        {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}

        {pendingTransaction ? (
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto text-center">
            <p className="text-black mb-4">
              Anda telah mengirimkan bukti pembayaran. Harap menunggu verifikasi dari admin.
            </p>
            <a
              href="/pelanggan/transaksi"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Lihat Transaksi
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <div className="mb-4">
              <label className="block text-black mb-2">Metode Pembayaran</label>
              <input
                type="text"
                value={metodePembayaran}
                onChange={(e) => setMetodePembayaran(e.target.value)}
                className="w-full p-2 border rounded text-black"
                placeholder="Misal: Transfer Bank, COD"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-black mb-2">Bukti Pembayaran</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBuktiPembayaran(e.target.files[0])}
                className="w-full p-2 border rounded text-black"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
            >
              Bayar
            </button>
          </form>
        )}
      </main>
    </>
  );
}