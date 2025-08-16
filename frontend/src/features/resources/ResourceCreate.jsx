import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../axiosConfig';

export default function ResourceCreate() {
  const nav = useNavigate();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('link');
  const [tags, setTags] = useState(''); // comma-separated
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setSaving(true);
    try {
      await api.post('/api/resources', {
        title,
        url,
        type,
        description,
        tags // backend accepts string or array; we send string for simplicity
      });
      nav('/resources');
    } catch (e) {
      const s = e?.response?.status;
      setErr(s === 401 ? 'Please log in to create a resource.' : 'Failed to create resource.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-3">
        <Link to="/resources" className="text-sm text-indigo-600">Back</Link>
      </div>
      <h1 className="text-xl font-semibold mb-4">Add Resource</h1>
      {!!err && <div className="mb-3 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">{err}</div>}

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Title *</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g., Beyond Blue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">URL</label>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select
              className="mt-1 w-full rounded border px-3 py-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="link">link</option>
              <option value="doc">doc</option>
              <option value="video">video</option>
              <option value="other">other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Tags (comma-separated)</label>
            <input
              className="mt-1 w-full rounded border px-3 py-2"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., support, anxiety"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="mt-1 w-full rounded border px-3 py-2"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-60"
        >
          {saving ? 'Creating…' : 'Create resource'}
        </button>
      </form>
    </div>
  );
}
