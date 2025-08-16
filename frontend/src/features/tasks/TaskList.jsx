import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../axiosConfig';

const STATUS_CLASSES = {
  TODO: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-800',
  DONE: 'bg-emerald-100 text-emerald-700',
};

export default function TaskList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  async function load() {
    try {
      setLoading(true);
      setErr('');
      // 🔧 IMPORTANT: hit /api/tasks (not /tasks)
      const { data } = await api.get('/api/tasks');
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      await load();
    } catch {
      alert('Please log in to delete.');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-gray-500">Manage your personal and support-related tasks here.</p>
        </div>
        <Link
          to="/tasks/new"
          className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
        >
          + Add Task
        </Link>
      </div>

      {loading && <div className="text-sm text-gray-500">Loading tasks…</div>}
      {!!err && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{err}</div>}

      {!loading && !err && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <p className="text-gray-500">No tasks yet. Click “Add Task” to create one.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(t => (
          <div key={t._id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-base font-medium">{t.title}</h3>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_CLASSES[t.status || 'TODO'] || STATUS_CLASSES.TODO}`}>
                {(t.status || 'TODO').replace(/_/g, ' ')}
              </span>
            </div>
            {t.description && <p className="mb-3 text-sm text-gray-600">{t.description}</p>}
            {t.dueDate && (
              <div className="mb-4 text-xs text-slate-500">
                Due: {new Date(t.dueDate).toLocaleDateString()}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Link to={`/tasks/${t._id}/edit`} className="px-3 py-2 bg-gray-100 text-sm rounded">Edit</Link>
              <button onClick={() => onDelete(t._id)} className="px-3 py-2 bg-red-100 text-red-700 text-sm rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
