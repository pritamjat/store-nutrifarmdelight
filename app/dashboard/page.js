import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import LogoutButton from './logout-button';

export default async function DashboardPage() {
  const token = cookies().get('auth_token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const payload = await verifyToken(token);

    return (
      <main>
        <section className="card">
          <h1>Dashboard</h1>
          <p>Welcome back, {payload.name}.</p>
          <p>Email: {payload.email}</p>
          <LogoutButton />
        </section>
      </main>
    );
  } catch (error) {
    redirect('/login');
  }
}
