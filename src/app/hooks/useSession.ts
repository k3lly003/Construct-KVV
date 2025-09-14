import { useCallback, useState } from 'react';
import { sessionService, SessionDevice } from '@/app/services/sessionService';

export interface UseSessionResult {
  loading: boolean;
  error: string | null;
  sessions: SessionDevice[];
  getActive: () => Promise<SessionDevice[]>;
  logout: () => Promise<boolean>;
  logoutAll: () => Promise<boolean>;
  refresh: () => Promise<string | null>;
}

export function useSession(): UseSessionResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionDevice[]>([]);

  const wrap = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      return await fn();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getActive = useCallback(async () => {
    const items = await wrap(() => sessionService.getActive());
    setSessions(items);
    return items;
  }, [wrap]);

  const logout = useCallback(async () => {
    try {
      await wrap(() => sessionService.logoutCurrent());
    } catch {
      // ignore server errors and proceed with client-side cleanup
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return true;
  }, [wrap]);

  const logoutAll = useCallback(async () => {
    try {
      await wrap(() => sessionService.logoutAll());
    } catch {
      // ignore server errors and proceed with client-side cleanup
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return true;
  }, [wrap]);

  const refresh = useCallback(async () => {
    const token = await wrap(() => sessionService.refresh());
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
    return token;
  }, [wrap]);

  return { loading, error, sessions, getActive, logout, logoutAll, refresh };
}
