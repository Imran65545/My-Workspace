import "./globals.css";
import Footer from "@/components/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionLayout from "@/components/SessionLayout";

export const metadata = {
  title: "My Workspace",
  description: "A Personal Productivity App"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <SessionLayout>
          <ToastContainer position="top-right" autoClose={3000} />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </SessionLayout>
      </body>
    </html>
  );
}
