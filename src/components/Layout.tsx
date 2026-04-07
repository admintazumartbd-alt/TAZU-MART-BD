import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F8]">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
