const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  // Inject Bearer token if present in localStorage or store
  const token = typeof window !== "undefined" ? localStorage.getItem("gramvikas_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string> || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(err.detail || `HTTP Error ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`[API fetch error on ${endpoint}]:`, error);
    throw error;
  }
}

// ================= AUTHENTICATION APIS =================
export async function loginUser(creds: { email: string; password: string }) {
  return request<any>("/auth/login", {
    method: "POST",
    body: JSON.stringify(creds),
  });
}

export async function demoLogin(role: "entrepreneur" | "admin" = "entrepreneur") {
  return request<any>(`/auth/demo-login?role=${role}`, {
    method: "POST",
  });
}

export async function signupUser(userIn: {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
  language?: string;
}) {
  return request<any>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(userIn),
  });
}

export async function googleLoginUser(payload: { email?: string; name?: string; credential?: string }) {
  return request<any>("/auth/google", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUserProfile() {
  return request<any>("/auth/me");
}

export async function updateUserProfile(updates: {
  full_name?: string;
  phone?: string;
  language?: string;
}) {
  return request<any>("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function requestPasswordReset(email: string) {
  return request<any>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function confirmPasswordReset(token: string, newPassword: string) {
  return request<any>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, new_password: newPassword }),
  });
}

// ================= DOMAIN APIS =================
// 1. Overview Analytics
export async function getOverview() {
  return request<any>("/analytics/overview");
}

// 2. Geo & Locations
export async function getDistricts(): Promise<string[]> {
  return request<string[]>("/geo/districts");
}

export async function getMandals(district: string): Promise<string[]> {
  return request<string[]>(`/geo/mandals?district=${encodeURIComponent(district)}`);
}

export async function getVillages(district: string, mandal?: string): Promise<any[]> {
  const query = mandal
    ? `/geo/villages?district=${encodeURIComponent(district)}&mandal=${encodeURIComponent(mandal)}`
    : `/geo/villages?district=${encodeURIComponent(district)}`;
  return request<any[]>(query);
}

// 3. Financial Calculation
export async function calculateFinancials(marginCapital: number, projectCost?: number) {
  return request<any>("/financial/calculate", {
    method: "POST",
    body: JSON.stringify({
      margin_capital: marginCapital,
      project_cost: projectCost,
    }),
  });
}

// 4. Business Recommendations
export async function getBusinessRecommendations(params: {
  district: string;
  mandal?: string;
  village?: string;
  business_category?: string;
  margin_capital: number;
  gender?: string;
  social_category?: string;
}) {
  return request<any>("/business/recommend", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

// 5. SWOT Analysis with Localized Causal Grounding
export async function getSwotAnalysis(params: {
  title: string;
  category: string;
  district: string;
  mandal?: string;
  village?: string;
  competition?: string;
  margin_capital: number;
}) {
  const query = `/business/swot?title=${encodeURIComponent(params.title)}&category=${encodeURIComponent(params.category)}&district=${encodeURIComponent(params.district)}&mandal=${encodeURIComponent(params.mandal || "")}&village=${encodeURIComponent(params.village || "")}&competition=${encodeURIComponent(params.competition || "Medium")}&margin_capital=${params.margin_capital}`;
  return request<any>(query);
}

// 6. Schemes
export async function getSchemes(params: {
  gender?: string;
  category?: string;
  budget?: number;
  business_type?: string;
}) {
  return request<any>("/schemes/recommend", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

// 7. Radius Search
export async function getRadiusAnalysis(district: string, village: string, radiusKm: number) {
  return request<any>("/geo/radius", {
    method: "POST",
    body: JSON.stringify({
      district,
      village_name: village,
      radius_km: radiusKm,
    }),
  });
}

// 8. Market Gap Analysis
export async function getMarketGap(district: string) {
  return request<any>(`/analytics/market-gap?district=${encodeURIComponent(district)}`);
}

// 9. District Analytics
export async function getDistrictAnalytics(name: string) {
  return request<any>(`/analytics/district?name=${encodeURIComponent(name)}`);
}

// 10. AI Chat
export async function sendChatMessage(params: {
  query: string;
  session_id?: string;
  district?: string;
  village?: string;
  category?: string;
}) {
  return request<any>("/chat/message", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

// 11. Admin Dashboard
export async function getAdminDashboard() {
  return request<any>("/admin/dashboard");
}

// 12. Report Download URL
export function getReportDownloadUrl(district: string, village: string, category: string, margin: number) {
  return `${API_BASE}/reports/download?district=${encodeURIComponent(district)}&village=${encodeURIComponent(village)}&category=${encodeURIComponent(category)}&margin=${margin}`;
}
