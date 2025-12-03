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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
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
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Masuk ke TokoOnline</h1>
        <form onSubmit={handleSubmit} className="login-form">
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
            />
          </div>
          <button type="submit" className="login-button">
            Masuk
          </button>
        </form>

        <div className="register-link">
          <p>
            Belum punya akun?{' '}
            <button onClick={() => router.push('/register')}>Daftar Sekarang</button>
          </p>
        </div>

        {error && <p className="error-message">{error}</p>}
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f5f5f5;
        }

        .login-box {
          width: 100%;
          max-width: 400px;
          padding: 2rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .login-title {
          font-size: 1.5rem;
          font-weight: bold;
          text-align: center;
          margin-bottom: 1.5rem;
          color: #333;
        }

        .login-form {
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
          border-color: #007bff;
          box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
        }

        .login-button {
          padding: 0.75rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .login-button:hover {
          background-color: #0056b3;
        }

        .register-link {
          margin-top: 1rem;
          text-align: center;
        }

        .register-link p {
          font-size: 0.9rem;
          color: #666;
        }

        .register-link button {
          color: #007bff;
          text-decoration: underline;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .register-link button:hover {
          color: #0056b3;
        }

        .error-message {
          margin-top: 1rem;
          text-align: center;
          color: #dc3545;
          font-size: 0.9rem;
        }

        @media (max-width: 480px) {
          .login-box {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}