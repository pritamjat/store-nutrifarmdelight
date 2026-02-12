import clientPromise from "@/lib/mongodb";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import AddressForm from "./AddressForm";

export default async function AddressPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) redirect("/login");

  let user;
  try {
    user = await verifyToken(token);
  } catch {
    redirect("/login");
  }

  const client = await clientPromise;
  const db = client.db();

  const dbUser = await db.collection("users").findOne(
    { _id: new ObjectId(user.sub) },
    { projection: { address: 1 } }
  );

  return (
    <div style={{ padding: "40px" }}>
      <h1>My Address</h1>
      <AddressForm initialAddress={dbUser?.address || {}} />
    </div>
  );
}

