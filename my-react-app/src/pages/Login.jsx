import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { login } from '../api/auth.api.js';

export default function Login() {
  const { login: setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await login({ email, password });
      setAuth(data.token, data.user);
      nav('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full overflow-hidden bg-[#0b1326] text-[#dae2fd]">
      <section className="relative hidden flex-1 items-center justify-center overflow-hidden bg-[#060e20] p-12 md:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(124,58,237,0.22),transparent_34rem),radial-gradient(circle_at_80%_70%,rgba(76,215,246,0.16),transparent_30rem)]" />
        <div className="relative z-10 max-w-2xl">
          <img
            alt="SmartStore AI neural commerce visualization"
            className="w-full rounded-3xl object-cover opacity-90 shadow-2xl mix-blend-screen"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuABp1FgYwjmfb0EDQMg-dod9rOfxjxMq_RmHo4cMsyHue5s-WJsDFqL2jiX7ORAcOfMuBZ5GCsz_eDMTKQmHp6CvloNnAsOVtUkPkfXskQV1PwG-lxodrg2qNmTkWRDkU3tsgJVcrerfuIIuqBJ2s4C7BIr1u3gE_FJXTOW04cr-EaISBy-QG0omrTKs8uRXzuDNj0snAcLlRPN5ZCyY6QD7LpY3nzQarxsMtIK5fnXe8hpeB1iR6zZa7PsHfCS3g6fBvbJu9BXIU9k"
          />
          <div className="mt-12 space-y-4">
            <h1 className="text-5xl font-bold tracking-normal text-white">
              SmartStore <span className="bg-gradient-to-r from-[#d2bbff] to-[#4cd7f6] bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="max-w-lg text-lg leading-8 text-[#ccc3d8]">
              Predictive intelligence for revenue, inventory, and catalog decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-20 flex flex-1 items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl glass-card md:p-10">
          <div className="mb-10">
            <div className="mb-8 flex items-center gap-3 md:hidden">
              <span className="material-symbols-outlined text-5xl text-[#d2bbff]">psychology</span>
              <div>
                <h2 className="text-2xl font-bold text-[#d2bbff]">SmartStore AI</h2>
                <p className="font-mono text-xs uppercase tracking-widest text-[#ccc3d8]">Enterprise Admin</p>
              </div>
            </div>
            <h3 className="mb-2 text-3xl font-semibold text-[#dae2fd]">Welcome Back</h3>
            <p className="text-[#ccc3d8]">Access your administrative dashboard and AI insights.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {error && <p className="rounded-xl border border-[#ffb4ab]/20 bg-[#ffb4ab]/10 px-4 py-3 text-sm text-[#ffb4ab]">{error}</p>}
            <label className="block space-y-2">
              <span className="ml-1 font-mono text-sm text-[#ccc3d8]">Email Address</span>
              <span className="relative block">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#958da1]">alternate_email</span>
                <input className="w-full rounded-xl border border-[#4a4455]/40 bg-[#222a3d] py-4 pl-12 pr-4 text-[#dae2fd] outline-none transition focus:border-[#d2bbff]" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@smartstore.ai" type="email" required />
              </span>
            </label>

            <label className="block space-y-2">
              <span className="ml-1 font-mono text-sm text-[#ccc3d8]">Password</span>
              <span className="relative block">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#958da1]">lock</span>
                <input className="w-full rounded-xl border border-[#4a4455]/40 bg-[#222a3d] py-4 pl-12 pr-12 text-[#dae2fd] outline-none transition focus:border-[#d2bbff]" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" type={showPassword ? 'text' : 'password'} required />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#958da1] hover:text-[#dae2fd]" type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Toggle password visibility">
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </span>
            </label>

            <button className="primary-gradient-btn flex w-full items-center justify-center gap-3 rounded-xl py-4 font-bold text-[#25005a]" type="submit" disabled={submitting}>
              <span className={`material-symbols-outlined ${submitting ? 'animate-spin' : ''}`}>{submitting ? 'refresh' : 'login'}</span>
              {submitting ? 'Authorizing...' : 'Sign in to Dashboard'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#ccc3d8]">
            New here? <Link className="font-semibold text-[#4cd7f6] hover:underline" to="/signup">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
