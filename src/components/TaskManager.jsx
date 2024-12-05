import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [executionDate, setExecutionDate] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks and task history
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => setTasks(res.data))
      .catch((err) => toast.error("Failed to fetch tasks"));
  }, []);

  // Add Task
  const addTask = async () => {
    if (!taskName || !executionDate) {
      toast.error("Please fill in all fields");
      return;
    }
  
    const taskData = { taskName, executionDate };
    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem("token");
  
      if (!token) {
        toast.error("Authorization token is missing. Please log in again.");
        return;
      }
  
      // Include token in the headers
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/add-task`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setTasks([...tasks, res.data]);
      setTaskName("");
      setExecutionDate("");
      toast.success("Task Added Successfully");
  
//       setTimeout(() => {
//         window.location.reload();
//       }, 1500);
    } catch (err) {
      console.error("Error adding task:", err.message);
      toast.error("Failed to add task");
    }
  };

  // Edit Task
  const editTask = async (task) => {
    setTaskName(task.taskName);
    setExecutionDate(task.nextExecution);
    setEditingTask(task); // Set the task to be edited
  };

  const updateTask = async () => {
    if (!taskName || !executionDate) {
      toast.error("Please fill in all fields");
      return;
    }
    const taskData = { taskName, executionDate };
    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem("token");
  
      if (!token) {
        toast.error("Authorization token is missing. Please log in again.");
        return;
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/update-task/${editingTask._id}`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(
        tasks.map((task) => (task._id === editingTask._id ? res.data : task))
      );
      setTaskName("");
      setExecutionDate("");
      setEditingTask(null);
      toast.success("Task Updated Successfully");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem("token");
  
      if (!token) {
        toast.error("Authorization token is missing. Please log in again.");
        return;
      }

      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/delete-task/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(tasks.filter((task) => task._id !== id));
      toast.success("Task Deleted Successfully");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  // Fetch Task History (Logs)
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/task-history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setLogs(res.data))
      .catch((err) => toast.error("Failed to fetch task history"));
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
      <h2 className="text-2xl font-semibold mb-4">Task Manager</h2>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Task Name"
          className="w-full px-4 py-2 border rounded-lg"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          type="datetime-local"
          className="w-full px-4 py-2 border rounded-lg"
          value={executionDate}
          onChange={(e) => setExecutionDate(e.target.value)}
        />

        {editingTask ? (
          <button
            onClick={updateTask}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Update Task
          </button>
        ) : (
          <button
            onClick={addTask}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Add Task
          </button>
        )}
      </div>

      {/* Task List */}
      <ul className="space-y-4 mb-6">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="p-4 bg-gray-100 flex justify-between items-center rounded-lg"
          >
            <div>
              <h3 className="font-bold">{task.taskName}</h3>
              <p className="text-sm">
                Next Execution: {new Date(task.nextExecution).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => deleteTask(task._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => editTask(task)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>

      {/* Task History */}
      <h3 className="text-xl font-semibold mb-4">Task History</h3>
      <ul className="space-y-4">
        {logs.map((log) => (
          <li key={log._id} className="p-4 bg-gray-100 rounded-lg">
            <h4 className="font-bold">{log.taskName}</h4>
            <p className="text-sm">
              Executed at: {new Date(log.executionTime).toLocaleString()}
            </p>
            <p className="text-sm">Status: {log.status}</p>
            <p className="text-sm">Message: {log.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
