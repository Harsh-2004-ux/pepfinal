import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { signup } from '../api/auth.api.js';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const { login: setAuth } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await signup({ name, email, password });
      setAuth(data.token, data.user);
      nav('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Signup failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md border rounded-xl p-6 bg-white/70 backdrop-blur">
        <h1 className="text-3xl font-semibold mb-2">Create account</h1>
        {error && <p className="text-red-600 mb-3">{error}</p>}
        <label className="block text-left mb-2">Name</label>
        <input className="w-full border rounded px-3 py-2 mb-3" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="block text-left mb-2">Email</label>
        <input className="w-full border rounded px-3 py-2 mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="block text-left mb-2">Password</label>
        <input type="password" className="w-full border rounded px-3 py-2 mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-brand-600 text-white rounded py-2 font-medium" type="submit">Sign up</button>
        <p className="mt-3 text-sm">
          Already have an account? <Link className="text-brand-700 underline" to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

