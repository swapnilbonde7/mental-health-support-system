import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await register(name, email, password);
      navigate('/resources', { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="text-xl font-semibold mb-4">Create account</h1>
      {!!err && <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded border px-3 py-2" placeholder="Your name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="w-full rounded border px-3 py-2" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full rounded border px-3 py-2" placeholder="••••••••" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="rounded bg-indigo-600 px-3 py-2 text-white">Create account</button>
      </form>
      <div className="text-sm mt-3">
        Already have an account? <Link to="/login" className="text-indigo-600">Log in</Link>
      </div>
    </div>
  );
}
