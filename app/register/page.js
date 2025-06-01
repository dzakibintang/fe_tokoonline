'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [kataSandi, setKataSandi] = useState('');
  const [telepon, setTelepon] = useState('');
  const [alamat, setAlamat] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama,
          email,
          kata_sandi: kataSandi,
          telepon,
          alamat,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Bisa berupa objek error dari validator
        if (typeof data === 'object') {
          const messages = Object.values(data).flat().join(' ');
          setError(messages);
        } else {
          setError(data.message || 'Registrasi gagal');
        }
        return;
      }

      setSuccess('Registrasi berhasil, silakan login!');
      setNama('');
      setEmail('');
      setKataSandi('');
      setTelepon('');
      setAlamat('');

      // Optional: redirect ke login setelah 2 detik
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('Terjadi kesalahan saat registrasi');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nama"
          className="w-full p-2 border rounded"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Kata Sandi"
          className="w-full p-2 border rounded"
          value={kataSandi}
          onChange={(e) => setKataSandi(e.target.value)}
          required
          minLength={6}
        />
        <input
          type="text"
          placeholder="Telepon (opsional)"
          className="w-full p-2 border rounded"
          value={telepon}
          onChange={(e) => setTelepon(e.target.value)}
        />
        <input
          type="text"
          placeholder="Alamat (opsional)"
          className="w-full p-2 border rounded"
          value={alamat}
          onChange={(e) => setAlamat(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>
    </div>
  );
}
