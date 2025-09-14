import api from '@/lib/axios';

export type SessionDevice = {
  id: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt?: string;
  lastActiveAt?: string;
  current?: boolean;
};

type Envelope<T> = { success?: boolean; message?: string; data?: T; token?: string } & Partial<T>;

const base = '/api/v1/sessions';

export const sessionService = {
  async getActive(): Promise<SessionDevice[]> {
    const res = await api.get(base);
    const data = res.data as Envelope<SessionDevice[] | { sessions: SessionDevice[] }>;
    if (Array.isArray(data)) return data as unknown as SessionDevice[];
    if (Array.isArray((data as any).data)) return (data as any).data as SessionDevice[];
    if (Array.isArray((data as any).sessions)) return (data as any).sessions as SessionDevice[];
    return [];
  },

  async logoutCurrent(): Promise<boolean> {
    const res = await api.post(`${base}/logout`);
    const data = res.data as Envelope<{ success: boolean }>;
    return Boolean((data as any)?.success ?? true);
  },

  async logoutAll(): Promise<boolean> {
    const res = await api.post(`${base}/logout-all`);
    const data = res.data as Envelope<{ success: boolean }>;
    return Boolean((data as any)?.success ?? true);
  },

  async refresh(): Promise<string | null> {
    const res = await api.post(`${base}/refresh`);
    const data = res.data as Envelope<{ token: string }>;
    const token = (data as any)?.data?.token ?? (data as any)?.token ?? null;
    return token ?? null;
  },
};




