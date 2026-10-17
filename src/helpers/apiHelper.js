const TOKEN_KEY = "delcom_token";

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const putAccessToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeAccessToken = () => localStorage.removeItem(TOKEN_KEY);

/** Pembungkus fetch. Mengembalikan { ok, message, data } (ok = status === "success"). */
export async function apiFetch(path, { method = "GET", body, form } = {}) {
  const headers = {};
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) payload = form;
  else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  try {
    const res = await fetch(`${DELCOM_API_URL}${path}`, { method, headers, body: payload });
    const json = await res.json();
    return { ok: json.status === "success", message: json.message, data: json.data };
  } catch {
    return { ok: false, message: "Gagal terhubung ke server", data: null };
  }
}
