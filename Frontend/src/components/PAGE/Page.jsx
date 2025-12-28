import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { GrBusinessService } from "react-icons/gr";
import useBilling from '../../hooks/useBilling';

function Page() {
  const navigate = useNavigate();
  const {getCredit}=useBilling()

  useEffect(() => {
    getCredit()
    if (!localStorage.getItem('authToken')) {
      navigate('/login');
    }
  }, [navigate]);

  const [text] = useTypewriter({
    words: ['Managed !', 'Recorded !', 'Resolved !', 'Notified !'],
    loop: 0,
    typeSpeed: 120,
    deleteSpeed: 80,
  });

  return (
    <>
      <div className="bg-slate-50 min-h-[90vh] flex flex-col">
        <div className="flex justify-center items-center flex-1">
          <div className="items-center justify-center">
            <div className="text-center">
              <div className="flex justify-center items-center mb-5">
                <GrBusinessService className="text-8xl text-slate-800" />
              </div>
              <h1 className="font-bold text-3xl md:text-4xl mb-5 text-slate-900">
                Merchant SMS and Payments :<br />
                <span className="font-bold text-4xl md:text-5xl mb-5 text-blue-800">
                  {/* {text} */}
                  <br />
                </span>
                {/* <Cursor /> */}
              </h1>
              <div className='flex gap-5 mt-5 flex-wrap justify-center items-center'>

                <NavLink to="/create-compaign">
                  <button
                    type="button"
                    className="bg-slate-900 p-3 md:w-64 md:h-44 md:p-4 rounded-3xl text-white font-bold text-lg md:text-xl"
                  >
                    Create SMS Campaign 
                  </button>
                </NavLink>

                <NavLink to="/get-compaign">
                  <button
                    type="button"
                    className="bg-slate-900 p-3 md:w-64 md:h-44 md:p-4 rounded-3xl text-white font-bold text-lg md:text-xl"
                  >
                   Get Compaigns
                  </button>
                </NavLink>

                <NavLink to="/add-shopper">
                  <button
                    type="button"
                    className="bg-slate-900 p-3 md:w-64 md:h-44 md:p-4 rounded-3xl text-white font-bold text-lg md:text-xl"
                  >
                    Add Shopper 
                  </button>
                </NavLink>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
