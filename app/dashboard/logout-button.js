'use client';
import { useRouter } from 'next/navigation';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');

  :root {
    --orange: #e8621a;
    --orange-light: #fdf0e8;
    --text-soft: #5a5a55;
    --border: #e8e4de;
    --white: #ffffff;
  }

  .logout-btn {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.65rem 1.25rem;
    background: var(--white);
    color: var(--text-soft);
    border: 1px solid var(--border);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }

  .logout-btn:hover {
    border-color: var(--orange);
    color: var(--orange);
    background: var(--orange-light);
  }
`;

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <button className="logout-btn" type="button" onClick={logout}>
        Logout
      </button>
    </>
  );
}
