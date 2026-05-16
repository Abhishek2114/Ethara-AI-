import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && !original.url?.includes("/auth/login")) {
      original._retry = true;
      if (!refreshPromise) {
        refreshPromise = api
          .post("/auth/refresh")
          .then((res) => {
            localStorage.setItem("accessToken", res.data.data.accessToken);
            return res.data.data.accessToken;
          })
          .finally(() => { refreshPromise = null; });
      }
      try {
        const token = await refreshPromise;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        localStorage.removeItem("accessToken");
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
  reviewers: () => api.get("/auth/reviewers"),
};

export const dashboardApi = { stats: () => api.get("/dashboard/stats") };
export const projectsApi = {
  list: () => api.get("/projects"),
  create: (data) => api.post("/projects", data),
  flag: (id, note) => api.post(`/projects/${id}/flag`, { note }),
  request: (data) => api.post("/projects/request", data),
};
export const leaveApi = {
  list: (params) => api.get("/leave", { params }),
  create: (data) => api.post("/leave", data),
  updateStatus: (id, status) => api.patch(`/leave/${id}/status`, { status }),
};
export const attendanceApi = {
  list: (params) => api.get("/attendance", { params }),
  checkIn: () => api.post("/attendance/check-in"),
};
export const taskersApi = { list: () => api.get("/taskers") };
export const analyticsApi = { team: () => api.get("/analytics/team") };
export const notificationsApi = {
  list: () => api.get("/notifications"),
  readAll: () => api.patch("/notifications/read-all"),
};
export const workItemsApi = {
  list: (params) => api.get("/work-items", { params }),
  listByProject: (projectId) => api.get(`/work-items/project/${projectId}`),
  create: (data) => api.post("/work-items", data),
  updateStatus: (id, status) => api.patch(`/work-items/${id}/status`, { status }),
  review: (id, data) => api.patch(`/work-items/${id}/review`, data),
};
export const inboxApi = { get: () => api.get("/inbox") };
export const activityApi = {
  list: (limit = 30) => api.get("/activity", { params: { limit } }),
};
