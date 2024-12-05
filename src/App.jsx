import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import TaskManager from './components/TaskManager';
import LogViewer from './components/LogViewer';
import FrequencyChart from './components/FrequencyChart';
import Login from './components/Login';
import Signup from './components/Signup';

// Auth Context
export const AuthContext = React.createContext();
//import.meta.env.VITE_API_BASE_URL
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
        <header className="p-4 bg-black bg-opacity-40 shadow-md flex justify-between items-center">
          <h1 className="text-3xl font-extrabold tracking-wide">Task Scheduler</h1>
          <nav className="flex space-x-4">
            {user ? (
              <>
                <Link
                  to="/"
                  className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded transition duration-300"
                >
                  Tasks
                </Link>
                <Link
                  to="/logs"
                  className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded transition duration-300"
                >
                  Logs
                </Link>
                <Link
                  to="/chart"
                  className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded transition duration-300"
                >
                  Frequency Chart
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-700 rounded transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-40 rounded transition duration-300"
                >
                  Signup
                </Link>
              </>
            )}
          </nav>
        </header>
        <main className="p-6 space-y-8">
          <Routes>
            <Route
              path="/"
              element={
                user ? <TaskManager /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/logs"
              element={
                user ? <LogViewer /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/chart"
              element={
                user ? <FrequencyChart /> : <Navigate to="/login" replace />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
