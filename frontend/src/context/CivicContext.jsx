import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const CivicContext = createContext();
const API_BASE = 'http://localhost:5001/api';

export function CivicProvider({ children }) {
  const { token } = useAuth();
  const [issues, setIssues] = useState([]);
  const [wards, setWards] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchIssues = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/issues`, authHeader);
      setIssues(res.data);
    } catch (err) {
      console.error('Error loading issues:', err);
    }
  };

  const fetchWards = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/wards/analytics`, authHeader);
      setWards(res.data);
    } catch (err) {
      console.error('Error loading wards:', err);
    }
  };

  const fetchWorkers = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/workers`, authHeader);
      setWorkers(res.data);
    } catch (err) {
      console.error('Error loading workers:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchIssues();
      fetchWards();
      fetchWorkers();
    }
  }, [token]);

  const createIssue = async (payload) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/issues`, payload, authHeader);
      await fetchIssues();
      await fetchWards();
      notify('⚡ AI Auto-Triage: Classified, prioritized & routed.');
    } catch (err) {
      notify('❌ Failed to submit complaint.');
    } finally {
      setLoading(false);
    }
  };

  // ⚡ DEDICATED TASK ASSIGNMENT DISPATCHER
  const assignTaskToWorker = async (ticketId, assignmentData) => {
    try {
      await axios.post(`${API_BASE}/issues/${ticketId}/assign`, assignmentData, authHeader);
      await fetchIssues();
      await fetchWorkers();
      notify(`⚡ Task ${ticketId} successfully dispatched to ${assignmentData.workerName}!`);
    } catch (err) {
      notify('❌ Failed to assign worker.');
    }
  };

  const updateIssue = async (ticketId, updateData) => {
    try {
      await axios.patch(`${API_BASE}/issues/${ticketId}`, updateData, authHeader);
      await fetchIssues();
      await fetchWards();
      await fetchWorkers();
    } catch (err) {
      console.error('Error updating issue:', err);
    }
  };

  return (
    <CivicContext.Provider
      value={{
        issues,
        wards,
        workers,
        createIssue,
        assignTaskToWorker,
        updateIssue,
        fetchIssues,
        fetchWards,
        fetchWorkers,
        loading,
        notification,
        notify,
      }}
    >
      {children}
    </CivicContext.Provider>
  );
}

export const useCivic = () => useContext(CivicContext);