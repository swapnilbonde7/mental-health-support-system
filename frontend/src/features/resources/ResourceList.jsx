import { useEffect, useState } from "react";
import api from "../../axiosConfig";

const typeClasses = {
  link: "bg-blue-100 text-blue-700 ring-blue-200",
  doc: "bg-amber-100 text-amber-700 ring-amber-200",
  video: "bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-200",
  other: "bg-gray-100 text-gray-700 ring-gray-200",
};

export default function ResourceList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        // IMPORTANT: no /api here because axios baseURL = '/api'
        const { data } = await api.get("/resources");
        if (alive) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        if (alive) {
          setErr(
            e?.response?.status === 401
              ? "Please log in to view resources."
              : "Failed to load resources."
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Resources</h1>
          <p className="text-sm text-gray-500">
            Curated links & docs for the Mental Health Support System.
          </p>
        </div>
      </div>

      {loading && (
        <div className="text-sm text-gray-500">Loading resources…</div>
      )}
      {!!err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {err}
        </div>
      )}

      {!loading && !err && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <p className="text-gray-500">No resources yet.</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => {
          const badge =
            typeClasses[(r?.type || "").toLowerCase()] || typeClasses.other;

          return (
            <div
              key={r._id || r.id || r.url}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-base font-medium leading-6">
                  {r.title || "Untitled"}
                </h3>

                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${badge}`}
                >
                  {(r.type || "other").toUpperCase()}
                </span>
              </div>

              {r.description && (
                <p className="mb-3 line-clamp-3 text-sm text-gray-600">
                  {r.description}
                </p>
              )}

              <div className="mb-4 flex flex-wrap gap-1.5">
                {(r.tags || []).map((t) => (
                  <span
                    key={`${r._id || r.id}-${t}`}
                    className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <a
                  href={r.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Open
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
