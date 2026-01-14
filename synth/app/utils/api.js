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
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
