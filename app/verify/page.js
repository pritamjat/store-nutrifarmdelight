import clientPromise from "@/lib/mongodb";
import { redirect } from "next/navigation";

export default async function VerifyPage({ searchParams }) {
  const token = searchParams?.token;

  if (!token) {
    return <div>Invalid verification link.</div>;
  }

  const client = await clientPromise;
  const db = client.db();
  const users = db.collection("users");

  const user = await users.findOne({
    verificationToken: token,
    verificationTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    return <div>Verification link expired or invalid.</div>;
  }

  await users.updateOne(
    { _id: user._id },
    {
      $set: { isVerified: true },
      $unset: {
        verificationToken: "",
        verificationTokenExpiry: "",
      },
    }
  );

  redirect("/login");
}

