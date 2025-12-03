'use client';

import { useState, useEffect } from 'react';
import NavbarAdmin from '../../components/navbar_admin';

export default function TransaksiAdmin() {
  const [transaksi, setTransaksi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [status, setStatus] = useState('');

  // Ambil data transaksi saat komponen dimuat
  useEffect(() => {
    async function fetchTransaksi() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Silakan login terlebih dahulu');
          setLoading(false);
          return;
        }

        const res = await fetch('http://localhost:8000/api/transaksi', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Gagal mengambil data transaksi');
        }

        const data = await res.json();
        setTransaksi(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchTransaksi();
  }, []);

  // Fungsi untuk membuka modal detail transaksi
  const openModal = (transaksi) => {
    setSelectedTransaksi(transaksi);
    setStatus(transaksi.status);
    setModalOpen(true);
  };

  // Fungsi untuk mengubah status transaksi
  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/api/transaksi/${selectedTransaksi.id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal memperbarui status transaksi');
      }

      setTransaksi(
        transaksi.map((item) =>
          item.id === selectedTransaksi.id ? { ...item, status } : item
        )
      );
      setSuccess('Status transaksi berhasil diperbarui!');
      setModalOpen(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) return <div className="p-4 text-center text-black">Memuat...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <>
      <NavbarAdmin />
      <main className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-black mb-6">Daftar Transaksi</h1>

        {success && <div className="p-4 mb-4 bg-green-100 text-green-700 rounded">{success}</div>}
        {error && <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}

        {transaksi.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Pelanggan</th>
                  <th className="p-3 text-left">Metode Pembayaran</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transaksi.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-black">{item.id}</td>
                    <td className="p-3 text-black">{item.user?.nama || 'Unknown'}</td>
                    <td className="p-3 text-black">{item.metode_pembayaran}</td>
                    <td className="p-3 text-black">{item.status}</td>
                    <td className="p-3">
                      <button
                        onClick={() => openModal(item)}
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-black text-center">Belum ada transaksi tersedia.</p>
        )}

        {/* Modal untuk Detail dan Update Status Transaksi */}
        {modalOpen && selectedTransaksi && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <h2 className="text-2xl font-bold text-black mb-4">Detail Transaksi</h2>
              <div className="mb-4">
                <p className="text-black">
                  <strong>ID Transaksi:</strong> {selectedTransaksi.id}
                </p>
                <p className="text-black">
                  <strong>Pelanggan:</strong> {selectedTransaksi.user?.nama || 'Unknown'}
                </p>
                <p className="text-black">
                  <strong>Metode Pembayaran:</strong> {selectedTransaksi.metode_pembayaran}
                </p>
                <p className="text-black mb-2">
                  <strong>Bukti Pembayaran:</strong>
                </p>
                <img
                  src={`http://localhost:8000/storage/${selectedTransaksi.bukti_pembayaran}`}
                  alt="Bukti Pembayaran"
                  className="w-full h-48 object-contain rounded-md mb-4"
                />
                <p className="text-black mb-2">
                  <strong>Detail Keranjang:</strong>
                </p>
                <ul className="list-disc pl-5 mb-4">
                  {selectedTransaksi.detail_keranjang.map((detail, index) => (
                    <li key={index} className="text-black">
                      {detail.produk?.nama || 'Produk Tidak Ditemukan'} - Jumlah: {detail.jumlah}
                    </li>
                  ))}
                </ul>
                <div className="mb-4">
                  <label className="block text-black mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2 border rounded text-black"
                  >
                    <option value="menunggu">Menunggu</option>
                    <option value="diterima">Diterima</option>
                    <option value="ditolak">Ditolak</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateStatus}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}