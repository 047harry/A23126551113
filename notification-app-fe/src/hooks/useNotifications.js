import { useState, useEffect } from "react";
import { fetchNotifications } from "../api/notifications";

export function useNotifications() {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('url_db');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 1. Instantly register the raw environment key context
    const productionToken = import.meta.env.VITE_AUTH_TOKEN;
    if (productionToken) {
      localStorage.setItem('auth_token', productionToken);
    }

    // 2. Fire the connection verification check securely
    const loadEvaluationSpecs = async () => {
      setLoading(true);
      try {
        await fetchNotifications('info', 'state', 'Hook mounting handshake executed successfully');
        setError(false);
      } catch (err) {
        console.error("Evaluation framework initial connection failed", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadEvaluationSpecs();
  }, []); 

  useEffect(() => {
    const totalClicksCount = notifications.reduce((acc, curr) => acc + (curr.clicks?.length || 0), 0);
    setTotal(totalClicksCount);
  }, [notifications]);

  const setUrlDatabase = (updatedDb) => {
    setNotifications(updatedDb);
  };

  const totalPages = Math.ceil(notifications.length / 5) || 1;

  return { notifications, setUrlDatabase, total, totalPages, loading, error };
}