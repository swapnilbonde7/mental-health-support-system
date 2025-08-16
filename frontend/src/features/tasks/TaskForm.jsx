import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../axiosConfig';

const STATUS_LABELS = [
  { value: 'TODO',        label: 'To do' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'DONE',        label: 'Done' },
];

function normalizeStatus(s) {
  return String(s || 'TODO').trim().replace(/[\s-]+/g, '_').toUpperCase();
}

// Accepts "YYYY-MM-DD", "DD/MM/YYYY", or anything JS Date can parse.
// Returns ISO string (midnight local) or null.
function toISO(input) {
  if (!input) return null;

  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/;
  const m1 = input.match(ymd);
  if (m1) {
    const [, y, m, d] = m1;
    const dt = new Date(`${y}-${m}-${d}T00:00:00`);
    return isNaN(dt) ? null : dt.toISOString();
  }

  const dmy = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const m2 = input.match(dmy);
  if (m2) {
    const [, d, m, y] = m2;
    const dt = new Date(`${y}-${m}-${d}T00:00:00`);
    return isNaN(dt) ? null : dt.toISOString();
  }

  const dt = new Date(input);
  return isNaN(dt) ? null : dt.toISOString();
}

export default function TaskForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('TODO');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!isEdit) return;
      try {
        setErr('');
        // 🔧 IMPORTANT: /api/tasks/:id
        const { data } = await api.get(`/api/tasks/${id}`);
        if (!alive) return;
        setTitle(data.title || '');
        setDescription(data.description || '');
        setStatus(normalizeStatus(data.status || 'TODO'));
        if (data.dueDate) {
          const d = new Date(data.dueDate);
          if (!isNaN(d)) setDueDate(d.toISOString().slice(0, 10));
        }
      } catch (e) {
        if (!alive) return;
        setErr('Failed to load task.');
      }
    })();
    return () => { alive = false; };
  }, [id, isEdit]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErr('');

      const payload = {
        title: title.trim(),
        description,
        status: normalizeStatus(status),
        dueDate: toISO(dueDate),
      };

      if (isEdit) {
        // 🔧 IMPORTANT: /api/tasks/:id
        await api.put(`/api/tasks/${id}`, payload);
      } else {
        // 🔧 IMPORTANT: /api/tasks
        await api.post('/api/tasks', payload);
      }

      navigate('/tasks');
    } catch (e) {
      const code = e?.response?.status;
      if (code === 401) setErr('Failed to save task. Please log in and try again.');
      else if (code === 400) setErr(e?.response?.data?.message || 'Please check the form and try again.');
      else setErr('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{isEdit ? 'Edit Task' : 'Add Task'}</h1>
        <Link to="/tasks" className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
          Back
        </Link>
      </div>

      {!!err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {err}
        </div>
      )}

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Therapy session"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm h-28 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Extra notes…"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_LABELS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Due date</label>
            <input
              type="date"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? 'Saving…' : (isEdit ? 'Save changes' : 'Save task')}
        </button>
      </form>
    </div>
  );
}
