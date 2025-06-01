'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [kataSandi, setKataSandi] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          kata_sandi: kataSandi,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login gagal');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.peran);

      if (data.user.peran === 'admin') {
        router.push('/home_admin');
      } else if (data.user.peran === 'pelanggan') {
        router.push('/home_pelanggan');
      } else {
        router.push('/home');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>

      {/* Tombol register */}
      <div className="mt-4 text-center">
        <p>
          Belum punya akun?{' '}
          <button
            className="text-blue-600 underline hover:text-blue-800"
            onClick={() => router.push('/register')}
          >
            Register
          </button>
        </p>
      </div>

      {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
    </div>
  );
}
