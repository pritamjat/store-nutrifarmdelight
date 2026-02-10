'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Unable to register.');
      return;
    }

    setSuccess('Account created! You can login now.');
    setFormData({ name: '', email: '', password: '' });
  }

  return (
    <main>
      <section className="card">
        <h1>Create account</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">
            Name
            <input
              id="name"
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              required
            />
          </label>

          <label htmlFor="email">
            Email
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              required
            />
          </label>

          <label htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              minLength={6}
              value={formData.password}
              onChange={(event) => setFormData({ ...formData, password: event.target.value })}
              required
            />
          </label>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}
