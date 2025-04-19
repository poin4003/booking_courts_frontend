import { useState, useCallback } from 'react';
import { courtRepo } from '../api/features/CourtRepo';

export function useCourt() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await courtRepo.getCourts();
      setCourts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCourt = useCallback(async (name, location) => {
    try {
      setLoading(true);
      const newCourt = await courtRepo.addCourt({ name, location });
      setCourts((prev) => [...prev, newCourt]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { courts, loading, error, fetchCourts, addCourt };
}