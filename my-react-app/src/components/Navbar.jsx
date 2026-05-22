import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const nav = useNavigate();

  function onLogout() {
    logout();
    nav('/login');
  }

  return (
    <div className="border-b bg-white/60 backdrop-blur px-6 py-3 flex items-center justify-between">
      <div className="font-semibold text-lg">SmartStore AI</div>
      <div className="flex gap-4 items-center text-sm">
        <Link className="hover:underline" to="/dashboard">Dashboard</Link>
        <Link className="hover:underline" to="/products">Products</Link>
        <button className="text-red-600 hover:underline" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

