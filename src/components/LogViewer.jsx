import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
console.log(logs);

  // Fetch logs with token in the Authorization header
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Retrieve token from localStorage or your preferred storage
        const token = localStorage.getItem('token'); // Ensure the token is stored after user login
        
        if (!token) {
          toast.error('Authorization token is missing. Please log in again.');
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLogs(res.data);
      } catch (err) {
        toast.error('Failed to fetch logs');
        console.error('Error fetching logs:', err.message);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-lg">
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h2 className="text-2xl font-semibold mb-4">Execution Logs</h2>
      <ul className="space-y-4">
        {logs.map((log) => (
          <li key={log._id} className="p-4 bg-gray-100 rounded-lg">
            <p><strong>Task:</strong> {log.taskName}</p>
            <p><strong>Status:</strong> {log.status}</p>
            <p><strong>Message:</strong> {log.message}</p>
            <p><strong>Time:</strong> {new Date(log.executionTime).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogViewer;
