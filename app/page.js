import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import ProductList from "@/app/components/ProductList";

export default async function HomePage() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

  let user = null;

  if (token) {
    try {
      user = await verifyToken(token);
    } catch (err) {
      user = null;
    }
  }

  return (
    <div>

      <section className="hero">
        <h1>Fresh Organic Products Delivered to Your Doorstep</h1>
        <p>Flat 30% OFF on first order</p>
      </section>

      <ProductList />

    </div>
  );
}
