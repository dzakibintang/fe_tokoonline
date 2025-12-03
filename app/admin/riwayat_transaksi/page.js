'use client';

import { useState, useEffect } from 'react';
import NavbarAdmin from '../../components/navbar_admin';

export default function RiwayatTransaksiAdmin() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRiwayat, setSelectedRiwayat] = useState(null);

  // Ambil data riwayat transaksi saat komponen dimuat
  useEffect(() => {
    async function fetchRiwayat() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Silakan login terlebih dahulu');
          setLoading(false);
          return;
        }

        const res = await fetch('http://localhost:8000/api/riwayat-transaksi', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Gagal mengambil data riwayat transaksi');
        }

        const data = await res.json();
        setRiwayat(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchRiwayat();
  }, []);

  // Fungsi untuk membuka modal detail riwayat
  const openModal = (riwayat) => {
    setSelectedRiwayat(riwayat);
    setModalOpen(true);
  };

  if (loading) return <div className="p-4 text-center text-black">Memuat...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <>
      <NavbarAdmin />
      <main className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-black mb-6">Riwayat Transaksi</h1>

        {riwayat.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Pelanggan</th>
                  <th className="p-3 text-left">Metode Pembayaran</th>
                  <th className="p-3 text-left">Tanggal</th>
                  <th className="p-3 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {riwayat.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-black">{item.id}</td>
                    <td className="p-3 text-black">{item.user?.nama || 'Unknown'}</td>
                    <td className="p-3 text-black">{item.metode_pembayaran}</td>
                    <td className="p-3 text-black">{new Date(item.tanggal_transaksi).toLocaleDateString('id-ID')}</td>
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
          <p className="text-black text-center">Belum ada riwayat transaksi tersedia.</p>
        )}

        {/* Modal untuk Detail Riwayat Transaksi */}
        {modalOpen && selectedRiwayat && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <h2 className="text-2xl font-bold text-black mb-4">Detail Riwayat Transaksi</h2>
              <div className="mb-4">
                <p className="text-black">
                  <strong>ID Transaksi:</strong> {selectedRiwayat.id}
                </p>
                <p className="text-black">
                  <strong>Pelanggan:</strong> {selectedRiwayat.user?.nama || 'Unknown'}
                </p>
                <p className="text-black">
                  <strong>Metode Pembayaran:</strong> {selectedRiwayat.metode_pembayaran}
                </p>
                <p className="text-black mb-2">
                  <strong>Tanggal Transaksi:</strong> {new Date(selectedRiwayat.tanggal_transaksi).toLocaleDateString('id-ID')}
                </p>
                <p className="text-black mb-2">
                  <strong>Bukti Pembayaran:</strong>
                </p>
                <img
                  src={`http://localhost:8000/storage/${selectedRiwayat.bukti_pembayaran}`}
                  alt="Bukti Pembayaran"
                  className="w-full h-48 object-contain rounded-md mb-4"
                />
                <p className="text-black mb-2">
                  <strong>Detail Keranjang:</strong>
                </p>
                <ul className="list-disc pl-5 mb-4">
                  {selectedRiwayat.detail_keranjang.map((detail, index) => (
                    <li key={index} className="text-black">
                      {detail.produk?.nama || 'Produk Tidak Ditemukan'} - Jumlah: {detail.jumlah}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}