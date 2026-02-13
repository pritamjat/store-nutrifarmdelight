'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --cream: #faf7f2;
    --ink: #1a1a18;
    --ink-soft: #4a4a45;
    --gold: #c9a84c;
    --gold-light: #e8d5a3;
    --rust: #b85c38;
    --border: #e0d8cc;
    --white: #ffffff;
  }

  .login-root {
    min-height: 100vh;
    background-color: var(--cream);
    background-image:
      radial-gradient(ellipse at 20% 50%, rgba(201,168,76,0.06) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, rgba(184,92,56,0.05) 0%, transparent 50%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    font-family: 'DM Sans', sans-serif;
  }

  .login-root * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .login-wrapper {
    width: 100%;
    max-width: 440px;
    position: relative;
  }

  .login-wrapper::before {
    content: '';
    position: absolute;
    top: -12px;
    left: -12px;
    width: 48px;
    height: 48px;
    border-top: 2px solid var(--gold);
    border-left: 2px solid var(--gold);
    pointer-events: none;
  }

  .login-wrapper::after {
    content: '';
    position: absolute;
    bottom: -12px;
    right: -12px;
    width: 48px;
    height: 48px;
    border-bottom: 2px solid var(--gold);
    border-right: 2px solid var(--gold);
    pointer-events: none;
  }

  .login-card {
    background: var(--white);
    border: 1px solid var(--border);
    padding: 3rem 2.75rem;
    box-shadow:
      0 2px 8px rgba(26,26,24,0.04),
      0 12px 40px rgba(26,26,24,0.08);
  }

  .login-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 0.6rem;
  }

  .login-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    font-weight: 600;
    color: var(--ink);
    line-height: 1.2;
    margin-bottom: 2.25rem;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
  }

  .login-field {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .login-label {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }

  .login-input {
    appearance: none;
    border: 1px solid var(--border);
    background: var(--cream);
    padding: 0.75rem 1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 300;
    color: var(--ink);
    outline: none;
    transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  }

  .login-input::placeholder {
    color: #c4bdb3;
  }

  .login-input:focus {
    border-color: var(--gold);
    background: var(--white);
    box-shadow: 0 0 0 3px rgba(201,168,76,0.1);
  }

  .login-error {
    font-size: 0.82rem;
    color: var(--rust);
    background: rgba(184,92,56,0.06);
    border: 1px solid rgba(184,92,56,0.2);
    padding: 0.65rem 0.9rem;
  }

  .login-btn {
    margin-top: 0.4rem;
    width: 100%;
    padding: 0.9rem 1.5rem;
    background: var(--ink);
    color: var(--cream);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border: 1px solid var(--ink);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: background 0.25s ease, color 0.25s ease;
  }

  .login-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gold);
    transform: translateX(-101%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .login-btn:hover::before {
    transform: translateX(0);
  }

  .login-btn:hover {
    color: var(--ink);
    border-color: var(--gold);
  }

  .login-btn span {
    position: relative;
    z-index: 1;
  }

  .login-footer {
    margin-top: 1.75rem;
    text-align: center;
    font-size: 0.85rem;
    font-weight: 300;
    color: var(--ink-soft);
  }

  .login-footer a {
    color: var(--ink);
    font-weight: 500;
    text-decoration: none;
    border-bottom: 1px solid var(--gold-light);
    padding-bottom: 1px;
    transition: border-color 0.2s ease;
  }

  .login-footer a:hover {
    border-color: var(--gold);
  }
`;

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || 'Unable to login.');
      return;
    }
    router.push('/');
    router.refresh();
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <main className="login-root">
        <div className="login-wrapper">
          <div className="login-card">
            <p className="login-eyebrow">Welcome back</p>
            <h1 className="login-title">Sign in</h1>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label className="login-label" htmlFor="email">Email</label>
                <input
                  className="login-input"
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  required
                />
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="password">Password</label>
                <input
                  className="login-input"
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  required
                />
              </div>

              {error && <p className="login-error">{error}</p>}

              <button className="login-btn" type="submit">
                <span>Login</span>
              </button>
            </form>

            <p className="login-footer">
              New here? <Link href="/register">Create account</Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
