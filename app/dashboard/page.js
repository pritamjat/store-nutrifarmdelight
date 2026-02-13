import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import LogoutButton from './logout-button';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --white: #ffffff;
    --orange: #e8621a;
    --orange-light: #fdf0e8;
    --green: #3a7d44;
    --green-light: #edf5ef;
    --text: #1c1c1a;
    --text-soft: #5a5a55;
    --text-muted: #9a9a95;
    --border: #e8e4de;
    --bg: #f9f9f7;
  }

  .dash-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .dash-root * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .dash-card {
    background: var(--white);
    border: 1px solid var(--border);
    padding: 2.5rem;
    width: 100%;
    max-width: 440px;
    box-shadow: 0 2px 8px rgba(26,26,24,0.04), 0 10px 32px rgba(26,26,24,0.07);
  }

  .dash-eyebrow {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--orange);
    margin-bottom: 0.5rem;
  }

  .dash-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.9rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 1.75rem;
  }

  .dash-divider {
    height: 1px;
    background: var(--border);
    margin-bottom: 1.5rem;
  }

  .dash-info {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    margin-bottom: 2rem;
  }

  .dash-info-row {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .dash-info-label {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .dash-info-value {
    font-size: 0.95rem;
    font-weight: 400;
    color: var(--text);
  }
`;

export default async function DashboardPage() {
  const token = cookies().get('auth_token')?.value;
  if (!token) {
    redirect('/login');
  }
  try {
    const payload = await verifyToken(token);
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <main className="dash-root">
          <section className="dash-card">
            <p className="dash-eyebrow">Account</p>
            <h1 className="dash-title">Dashboard</h1>
            <div className="dash-divider" />
            <div className="dash-info">
              <div className="dash-info-row">
                <span className="dash-info-label">Name</span>
                <span className="dash-info-value">{payload.name}</span>
              </div>
              <div className="dash-info-row">
                <span className="dash-info-label">Email</span>
                <span className="dash-info-value">{payload.email}</span>
              </div>
            </div>
            <LogoutButton />
          </section>
        </main>
      </>
    );
  } catch (error) {
    redirect('/login');
  }
}
