import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../axiosConfig';

export default function ResourceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('link');
  const [tags, setTags] = useState(''); // comma separated
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get(`/api/resources/${id}`);
        if (!alive) return;
        setTitle(data.title || '');
        setUrl(data.url || '');
        setType((data.type || 'link').toLowerCase());
        setTags((data.tags || []).join(', '));
        setDescription(data.description || '');
        setErr('');
      } catch (e) {
        setErr('Failed to load resource.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErr('');
      await api.put(`/api/resources/${id}`, {
        title,
        url,
        type,
        tags, // backend accepts string or array
        description,
      });
      navigate('/resources');
    } catch (e) {
      const code = e?.response?.status;
      if (code === 400) setErr(e?.response?.data?.message || 'Please check the form and try again.');
      else if (code === 401) setErr('Please log in to save changes.');
      else setErr('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit Resource</h1>
        <Link to="/resources" className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
          Back
        </Link>
      </div>

      {!!err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {err}
        </div>
      )}

      {!loading && (
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL</label>
            <input
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="support, anxiety"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm h-28 resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      )}
    </div>
  );
}
