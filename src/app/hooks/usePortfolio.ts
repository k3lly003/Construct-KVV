import { useCallback, useState } from 'react';
import { Portfolio, PortfolioPayload, PortfolioService, ProfessionalType } from '@/app/services/porfolioService';

interface UsePortfolioResult {
  loading: boolean;
  error: string | null;
  lastMessage: string | null;
  create: (payload: PortfolioPayload, authToken?: string) => Promise<Portfolio | null>;
  getById: (portfolioId: string) => Promise<Portfolio | null>;
  update: (portfolioId: string, payload: Partial<PortfolioPayload>, authToken?: string) => Promise<Portfolio | null>;
  toggleVisibility: (portfolioId: string, authToken?: string) => Promise<Portfolio | null>;
  remove: (portfolioId: string, authToken?: string) => Promise<boolean>;
  getPublicByProfessional: (type: ProfessionalType, id: string) => Promise<Portfolio[]>;
}

export function usePortfolio(): UsePortfolioResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const wrap = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback<UsePortfolioResult['create']>(async (payload, authToken) => {
    const res = await wrap(() => PortfolioService.createPortfolio(payload, authToken));
    setLastMessage(res.message ?? 'Created successfully');
    return res.data;
  }, [wrap]);

  const getById = useCallback<UsePortfolioResult['getById']>(async (portfolioId) => {
    const res = await wrap(() => PortfolioService.getById(portfolioId));
    return res;
  }, [wrap]);

  const update = useCallback<UsePortfolioResult['update']>(async (portfolioId, payload, authToken) => {
    const res = await wrap(() => PortfolioService.updatePortfolio(portfolioId, payload, authToken));
    setLastMessage(res.message ?? 'Updated successfully');
    return res.data;
  }, [wrap]);

  const toggleVisibility = useCallback<UsePortfolioResult['toggleVisibility']>(async (portfolioId, authToken) => {
    const res = await wrap(() => PortfolioService.toggleVisibility(portfolioId, authToken));
    setLastMessage(res.message ?? 'Visibility updated');
    return res.data;
  }, [wrap]);

  const getPublicByProfessional = useCallback<UsePortfolioResult['getPublicByProfessional']>(async (type, id) => {
    const res = await wrap(() => PortfolioService.getPublicByProfessional(type, id));
    return res;
  }, [wrap]);

  const remove = useCallback<UsePortfolioResult['remove']>(async (portfolioId, authToken) => {
    const res = await wrap(() => PortfolioService.deletePortfolio(portfolioId, authToken));
    setLastMessage(res.message ?? 'Deleted');
    return !!res.success;
  }, [wrap]);

  return { loading, error, lastMessage, create, getById, update, toggleVisibility, remove, getPublicByProfessional };
}




