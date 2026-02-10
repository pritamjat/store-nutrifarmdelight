import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import Storefront from './storefront';

export default async function DashboardPage() {
  const token = cookies().get('auth_token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const payload = await verifyToken(token);

    return <Storefront user={{ name: payload.name, email: payload.email }} />;
  } catch (error) {
    redirect('/login');
  }
}
