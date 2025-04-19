import { useState, useCallback } from 'react';
import { CourtModel } from '../models/CourtModel';

export function useCourt() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const courtModel = new CourtModel();

  const fetchCourts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await courtModel.getCourts();
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
      const newCourt = await courtModel.addCourt({ name, location });
      setCourts((prev) => [...prev, newCourt]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { courts, loading, error, fetchCourts, addCourt };
}