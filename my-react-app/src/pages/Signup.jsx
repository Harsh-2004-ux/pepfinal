import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { signup } from '../api/auth.api.js';

export default function Signup() {
  const { login: setAuth } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await signup(form);
      setAuth(data.token, data.user);
      nav('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1326] px-4 py-10 text-[#dae2fd]">
      <form onSubmit={onSubmit} className="w-full max-w-xl rounded-3xl p-8 shadow-2xl glass-card md:p-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#4cd7f6]">
            <span className="material-symbols-outlined text-white">bolt</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#d2bbff]">Create SmartStore Account</h1>
            <p className="text-[#ccc3d8]">Start managing inventory with AI-assisted workflows.</p>
          </div>
        </div>

        {error && <p className="mb-5 rounded-xl border border-[#ffb4ab]/20 bg-[#ffb4ab]/10 px-4 py-3 text-sm text-[#ffb4ab]">{error}</p>}

        <div className="space-y-5">
          {[
            ['name', 'Name', 'text', 'Alex Rivera'],
            ['email', 'Email Address', 'email', 'admin@smartstore.ai'],
            ['password', 'Password', 'password', 'Create a secure password'],
          ].map(([field, label, type, placeholder]) => (
            <label key={field} className="block space-y-2">
              <span className="ml-1 font-mono text-sm text-[#ccc3d8]">{label}</span>
              <input
                className="w-full rounded-xl border border-[#4a4455]/40 bg-[#222a3d] px-4 py-4 text-[#dae2fd] outline-none transition focus:border-[#d2bbff]"
                value={form[field]}
                onChange={(e) => update(field, e.target.value)}
                placeholder={placeholder}
                type={type}
                required
              />
            </label>
          ))}
        </div>

        <button className="primary-gradient-btn mt-8 flex w-full items-center justify-center gap-3 rounded-xl py-4 font-bold text-[#25005a]" type="submit" disabled={submitting}>
          <span className={`material-symbols-outlined ${submitting ? 'animate-spin' : ''}`}>{submitting ? 'refresh' : 'person_add'}</span>
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="mt-6 text-center text-sm text-[#ccc3d8]">
          Already have an account? <Link className="font-semibold text-[#4cd7f6] hover:underline" to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
