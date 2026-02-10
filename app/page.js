import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <section className="card">
        <h1>NutriFarm Delight Auth Demo</h1>
        <p>This Next.js app uses MongoDB, JWT cookies, and protected routes.</p>
        <div className="actions">
          <Link href="/register">Create account</Link>
          <Link href="/login">Sign in</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </section>
    </main>
  );
}
