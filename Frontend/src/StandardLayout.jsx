import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/NAVBAR/Navbar'; 
import Footer from './components/FOOTER/Footer'; 

const StandardLayout = () => {
  const location = useLocation();
  const noLayoutPaths = ['/login', '/signup']; // Define paths without layout

  return (
    <>
      {/* Render Navbar and Footer only if the path is NOT in noLayoutPaths */}
      {!noLayoutPaths.includes(location.pathname) && <Navbar />}
      <Outlet />
      {!noLayoutPaths.includes(location.pathname) && <Footer />}
    </>
  );
};

export default StandardLayout;
