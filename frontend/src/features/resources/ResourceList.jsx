// frontend/src/features/resources/ResourceList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../axiosConfig';

const typeClasses = {
  link:  'bg-blue-100 text-blue-700 ring-blue-200',
  doc:   'bg-amber-100 text-amber-700 ring-amber-200',
  video: 'bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-200',
  other: 'bg-gray-100 text-gray-700 ring-gray-200',
};

export default function ResourceList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/resources');
      setItems(Array.isArray(data) ? data : []);
      setErr('');
    } catch {
      setErr('Failed to load resources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    try {
      await api.delete(`/api/resources/${id}`);
      await load();
    } catch {
      alert('Please log in to delete.');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header (single Add Resource button kept here) */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Resources</h1>
          <p className="text-sm text-gray-500">
            Curated resources and documentation for the Mental Health Support System.
          </p>
        </div>
        <Link
          to="/resources/new"
          className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
        >
          + Add Resource
        </Link>
      </div>

      {loading && <div className="text-sm text-gray-500">Loading resources…</div>}

      {!!err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {err}
        </div>
      )}

      {!loading && !err && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <p className="text-gray-500">
            No resources yet. Click “Add Resource” to create one.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => {
          const badge =
            typeClasses[(r?.type || '').toLowerCase()] || typeClasses.other;

          return (
            <div
              key={r._id}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-base font-medium">{r.title}</h3>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${badge}`}
                >
                  {(r.type || 'other').toUpperCase()}
                </span>
              </div>

              {r.description && (
                <p className="mb-3 text-sm text-gray-600">{r.description}</p>
              )}

              <div className="mb-4 flex flex-wrap gap-1.5">
                {(r.tags || []).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={r.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                >
                  Open
                </a>
                <Link
                  to={`/resources/${r._id}/edit`}
                  className="px-3 py-2 bg-gray-100 text-sm rounded hover:bg-gray-200"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(r._id)}
                  className="px-3 py-2 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
