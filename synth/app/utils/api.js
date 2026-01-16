const API_BASE = "http://localhost:3001/api";

export async function apiGet(path, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
  });
  return res.json();
}

export async function apiPost(path, data, token) {
  const isFormData = data instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: isFormData
      ? { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
      : {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    body: isFormData ? data : JSON.stringify(data),
  });
  return res.json();
}

export async function apiDelete(path, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.json();
}
