const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
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

// 5. SWOT Analysis
export async function getSwotAnalysis(params: {
  title: string;
  category: string;
  district: string;
  competition?: string;
  margin_capital: number;
}) {
  const query = `/business/swot?title=${encodeURIComponent(params.title)}&category=${encodeURIComponent(params.category)}&district=${encodeURIComponent(params.district)}&competition=${encodeURIComponent(params.competition || "Medium")}&margin_capital=${params.margin_capital}`;
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
