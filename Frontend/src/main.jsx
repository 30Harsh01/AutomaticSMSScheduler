import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Page from './components/PAGE/Page'
import { Toaster } from 'react-hot-toast'; 
import Login from './components/LOGIN/Login'
import StandardLayout from './StandardLayout'
import Signup from './components/SIGNUP/Signup'
import CreateSMS from './components/SMS/CreateSMS'
import GetCampaignsPage from './components/SMS/GetCampaignsPage'
import AddShopperPage from './components/SHOPPER/AddShopperPage'
import Credits from './components/CREDITS/Credits'


const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); 

  if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
  }

  return children;
};

const router=createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path='/' element={<StandardLayout/>}>
      <Route path='' element={<ProtectedRoute><Page /></ProtectedRoute>} />
      {/* <Route path='login' element={<Login/>}/>
      <Route path='signup' element={<Signup/>}/> */}
      <Route path='create-compaign' element={<ProtectedRoute><CreateSMS/></ProtectedRoute>}/>
      <Route path='get-compaign' element={<ProtectedRoute><GetCampaignsPage/></ProtectedRoute>}/>
      <Route path='add-shopper' element={<ProtectedRoute><AddShopperPage/></ProtectedRoute>}/>
      <Route path='add-credit' element={<ProtectedRoute><Credits/></ProtectedRoute>}/>

    </Route>
    <Route path='login' element={<Login/>}/>
    <Route path='signup' element={<Signup/>}/>
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster reverseOrder={false} />  
    <RouterProvider router={router} />
  </React.StrictMode>,
)
