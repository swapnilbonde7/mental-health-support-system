import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../axiosConfig';

const TYPES = ['link', 'doc', 'video', 'other'];

function looksLikeHttpUrl(u) {
  try {
    const url = new URL(u);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function ResourceForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('link');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!isEdit) return;
      try {
        setErr('');
        const { data } = await api.get(`/api/resources/${id}`);
        if (!alive) return;
        setTitle(data.title || '');
        setUrl(data.url || '');
        setType((data.type || 'link').toLowerCase());
        setTags((data.tags || []).join(', '));
        setDescription(data.description || '');
      } catch (e) {
        if (!alive) return;
        setErr('Failed to load resource.');
      }
    })();
    return () => { alive = false; };
  }, [id, isEdit]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');

    // Client-side checks (mirror backend rules)
    if (!title.trim()) {
      setErr('Title is required.');
      return;
    }
    if (type === 'link') {
      if (!url || !looksLikeHttpUrl(url)) {
        setErr('Please enter a valid URL starting with http:// or https://');
        return;
      }
    } else if (url && !looksLikeHttpUrl(url)) {
      setErr('URL must start with http:// or https://');
      return;
    }

    const payload = {
      title: title.trim(),
      url: url.trim(),
      type,
      tags, // server accepts "a, b, c" or array
      description,
    };

    try {
      setSaving(true);
      if (isEdit) {
        await api.put(`/api/resources/${id}`, payload);
      } else {
        await api.post('/api/resources', payload);
      }
      navigate('/resources');
    } catch (e) {
      // surface server message if present
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        'Something went wrong. Please try again.';
      setErr(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{isEdit ? 'Edit Resource' : 'Add Resource'}</h1>
        <Link to="/resources" className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
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
          <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Black Dog Institute"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="https://example.org/page"
          />
          <p className="mt-1 text-xs text-slate-500">
            Required if type is <span className="font-medium">link</span>.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma-separated)</label>
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="support, depression, anxiety"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm h-28 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Short summary…"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? 'Saving…' : (isEdit ? 'Save changes' : 'Create resource')}
        </button>
      </form>
    </div>
  );
}
