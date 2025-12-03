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
      const res = await fetch('betokoonline-production-fbdf.up.railway.app/api/auth/register', {
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

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('Terjadi kesalahan saat registrasi');
    }
  }

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">Daftar ke TokoOnline</h1>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label htmlFor="nama">Nama</label>
            <input
              type="text"
              id="nama"
              placeholder="Masukkan nama Anda"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="kataSandi">Kata Sandi</label>
            <input
              type="password"
              id="kataSandi"
              placeholder="Masukkan kata sandi Anda"
              value={kataSandi}
              onChange={(e) => setKataSandi(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="input-group">
            <label htmlFor="telepon">Telepon (opsional)</label>
            <input
              type="text"
              id="telepon"
              placeholder="Masukkan nomor telepon Anda"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="alamat">Alamat (opsional)</label>
            <input
              type="text"
              id="alamat"
              placeholder="Masukkan alamat Anda"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
            />
          </div>
          <button type="submit" className="register-button">
            Daftar
          </button>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </form>
      </div>

      <style jsx>{`
        .register-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f5f5f5;
        }

        .register-box {
          width: 100%;
          max-width: 400px;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .register-title {
          font-size: 1.5rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 1.5rem;
          color: #333;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.9rem;
          color: #555;
        }

        .input-group input {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .input-group input:focus {
          outline: none;
          border-color: #28a745;
          box-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
        }

        .register-button {
          padding: 0.75rem;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .register-button:hover {
          background-color: #218838;
        }

        .error-message {
          margin-top: 1rem;
          text-align: center;
          color: #dc3545;
          font-size: 0.9rem;
        }

        .success-message {
          margin-top: 1rem;
          text-align: center;
          color: #28a745;
          font-size: 0.9rem;
        }

        @media (max-width: 480px) {
          .register-box {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}