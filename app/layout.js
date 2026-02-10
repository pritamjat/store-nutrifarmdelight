import './globals.css';

export const metadata = {
  title: 'NutriFarm Delight Store',
  description: 'NutriFarm Delight eCommerce app with products, cart, checkout, and Razorpay flow.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
