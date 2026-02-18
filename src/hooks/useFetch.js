import { useState, useEffect } from 'react';
import api from '../api/api';

/**
 * Hook genérico para fetching de datos con Axios.
 * Maneja los estados de carga, error y datos automáticamente.
 *
 * @param {string|null} url - Endpoint a consultar. Si es null/undefined, no hace nada.
 * @param {Array} deps - Dependencias del useEffect (como el id de la URL).
 * @returns {{ data, loading, error }} - Los tres estados del fetch.
 *
 * @example
 * const { data: album, loading, error } = useFetch(`/albums/${id}`, [id]);
 */
const useFetch = (url, deps = []) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    // Si no hay URL (ej: esperando un ID), no hacemos nada
    if (!url) {
      setLoading(false);
      return;
    }

    let cancelled = false; // Evita actualizar estado si el componente se desmontó

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get(url);
        if (!cancelled) {
          // Si la respuesta tiene un formato { data: ... }, usamos eso. Si no, asumimos que la data está en res.data directamente.
          setData(res.data.data ?? res.data);
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err.response?.data?.message || 'Error de conexión';
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    // Cleanup: si el componente se desmonta o cambia la URL, cancelamos
    return () => { cancelled = true; };

  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
};

export default useFetch;