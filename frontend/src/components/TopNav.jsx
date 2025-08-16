import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopNav() {
  const { isAuthed, logout } = useAuth();
  const navigate = useNavigate();

  const linkBase =
    'inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900';
  const active =
    'text-slate-900 border-b-2 border-indigo-600 rounded-none';

  return (
    <header className="sticky top-0 z-40 bg-slate-100/90 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            to="/resources"
            className="text-xl font-semibold tracking-tight text-indigo-600"
          >
            MHSS
          </Link>

          {/* Primary nav */}
          <nav className="ml-6 hidden sm:flex items-center gap-1">
            <NavLink
              to="/resources"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : ''}`
              }
            >
              Resources
            </NavLink>

            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? active : ''}`
              }
            >
              Tasks
            </NavLink>
          </nav>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {isAuthed ? (
            <>
              {/* Removed global "+ Add Resource" to avoid duplicate. */}
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="inline-flex items-center rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="inline-flex items-center rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-300"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Create account
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
