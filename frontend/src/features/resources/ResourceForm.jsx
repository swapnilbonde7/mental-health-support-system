import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../axiosConfig';

export default function ResourceForm() {
  const { id } = useParams(); // undefined for create
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', type:'link', url:'', tags:'', description:'' });
  const [loading, setLoading] = useState(!!id);
  const [err, setErr] = useState('');

  useEffect(() => {
    const loadOne = async () => {
      try {
        const { data } = await api.get('/resources'); // simple fetch-all then find
        const doc = data.find(d => d._id === id);
        if (doc) {
          setForm({
            title: doc.title || '',
            type: doc.type || 'link',
            url: doc.url || '',
            tags: Array.isArray(doc.tags) ? doc.tags.join(', ') : (doc.tags || ''),
            description: doc.description || '',
          });
        }
      } catch (e) {
        setErr('Failed to load resource');
      } finally {
        setLoading(false);
      }
    };
    if (id) loadOne();
  }, [id]);

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
    };
    try {
      if (id) await api.put(`/resources/${id}`, payload);
      else    await api.post('/resources', payload);
      navigate('/resources');
    } catch (e) {
      setErr('Save failed');
    }
  };

  if (loading) return <p style={{padding:16}}>Loading…</p>;

  return (
    <form onSubmit={onSubmit} style={{ padding: 16, maxWidth: 560 }}>
      <h2>{id ? 'Edit Resource' : 'Add Resource'}</h2>
      {err && <p style={{ color:'red' }}>{err}</p>}
      <div style={{ marginBottom: 10 }}>
        <label>Title<br/>
          <input name="title" value={form.title} onChange={onChange} required style={{ width:'100%' }} />
        </label>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>Type<br/>
          <input name="type" value={form.type} onChange={onChange} required style={{ width:'100%' }} />
        </label>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>URL<br/>
          <input name="url" value={form.url} onChange={onChange} required style={{ width:'100%' }} />
        </label>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>Tags (comma separated)<br/>
          <input name="tags" value={form.tags} onChange={onChange} style={{ width:'100%' }} />
        </label>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label>Description<br/>
          <textarea name="description" value={form.description} onChange={onChange} rows={4} style={{ width:'100%' }} />
        </label>
      </div>
      <button type="submit">{id ? 'Update' : 'Create'}</button>
      <button type="button" onClick={() => navigate('/resources')} style={{ marginLeft: 8 }}>Cancel</button>
    </form>
  );
}
