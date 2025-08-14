import React, { useState } from "react";

export default function ResourceForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    type: "article",
    url: "",
    tags: "",
    description: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Resource</h2>

      <label>Title
        <input name="title" value={form.title} onChange={handleChange} />
      </label>

      <label>Type
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="article">Article</option>
          <option value="video">Video</option>
          <option value="guide">Guide</option>
        </select>
      </label>

      <label>URL
        <input name="url" value={form.url} onChange={handleChange} />
      </label>

      <label>Tags (comma separated)
        <input name="tags" value={form.tags} onChange={handleChange} />
      </label>

      <label>Description
        <textarea name="description" value={form.description} onChange={handleChange}/>
      </label>

      <button type="submit">Save</button>
    </form>
  );
}
