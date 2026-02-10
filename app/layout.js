import './globals.css';

export const metadata = {
  title: 'NutriFarm Delight Auth',
  description: 'Next.js and MongoDB authentication example'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
