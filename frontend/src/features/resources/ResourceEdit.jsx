import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../axiosConfig';

export default function ResourceEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('link');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/api/resources/${id}`);
        setTitle(data.title || '');
        setUrl(data.url || '');
        setType(data.type || 'link');
        setTags((data.tags || []).join(', '));
        setDescription(data.description || '');
        setErr('');
      } catch (e) {
        setErr('Failed to load resource.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/resources/${id}`, {
        title, url, type, description, tags
      });
      nav('/resources');
    } catch (e) {
      setErr('Please log in to save changes.');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-3">
        <Link to="/resources" className="text-sm text-indigo-600">Back</Link>
      </div>
      <h1 className="text-xl font-semibold mb-4">Edit Resource</h1>
      {err && <div className="mb-3 text-red-600">{err}</div>}
      <form onSubmit={onSave} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="URL" value={url} onChange={e=>setUrl(e.target.value)} />
        <select className="w-full border p-2 rounded" value={type} onChange={e=>setType(e.target.value)}>
          <option value="link">link</option>
          <option value="doc">doc</option>
          <option value="video">video</option>
          <option value="other">other</option>
        </select>
        <input className="w-full border p-2 rounded" placeholder="Tags (comma separated)" value={tags} onChange={e=>setTags(e.target.value)} />
        <textarea className="w-full border p-2 rounded" rows={4} placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">Save changes</button>
      </form>
    </div>
  );
}
