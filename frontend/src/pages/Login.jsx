import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await login(email, password);
      nav('/resources');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Log in</h1>
      {err && <div className="mb-3 text-red-600">{err}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Log in</button>
      </form>
      <p className="mt-3 text-sm">No account? <Link to="/register" className="text-indigo-600">Register</Link></p>
    </div>
  );
}
