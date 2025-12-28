import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from "react-icons/fa";
import { MdSms } from "react-icons/md";
import toast from 'react-hot-toast';
import useBilling from '../../hooks/useBilling'; // Import useBilling hook

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { credit, getCredit } = useBilling(); // Fetch credit balance
  const navigate = useNavigate();

  useEffect(() => {
    getCredit(); 
  }, [navigate]);

  const toggleNav = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.clear(); // Clears all localStorage data
    toast.error('Logged out');
    navigate('/login'); // Redirect to login page
  };

  return (
    <>
      <nav className="w-full flex bg-gray-300 flex-wrap justify-between items-center p-7 top-0">
        <Link to="/">
          <div className="flex">
            <MdSms className="text-slate-800 text-3xl" />
            <h2 className="text-slate-900 hidden sm:block font-bold ml-2 text-xl tracking-wider">
              Merchant SMS & Payments
            </h2>
          </div>
        </Link>

        <button onClick={toggleNav} className="text-slate-800 md:hidden block focus:outline-none">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        <div className={`${isOpen ? 'block' : 'hidden'} w-full md:flex md:w-auto`}>
          <ul className="text-slate-800 font-semibold md:flex flex-col space-y-5 md:space-y-0 md:flex-row gap-5 text-[18px] w-full md:w-auto">

            {/* Credit Balance Display */}
            <li className="flex items-center">
              <span className="bg-white px-4 py-2 border border-gray-600">
                Credits: {credit ?? 0}
              </span>
              <NavLink to="/add-credit">

              <button 
                className=" bg-slate-600 border border-gray-600 text-white px-3 py-2 hover:bg-slate-700"
              >
                +
              </button>
              </NavLink>
            </li>

            {/* Logout Button */}
            <li>
              <button 
                onClick={handleLogout} 
                className="bg-slate-800 p-2 pl-4 pr-4 border-2 border-white rounded-lg hover:bg-slate-700 text-white"
              >
                Logout
              </button>
            </li>

          </ul>
        </div>
      </nav>
      <hr className='font-bold' />
    </>
  );
}

export default Navbar;
