import React, { useContext } from 'react';
import Sidebar from './components/Sidebar';
import { TaskProvider, TaskContext } from './context/TaskContext';
import Dashboard from './pages/Dashboard';
import CompletedTasks from './pages/CompletedTasks';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  return (
    <TaskProvider>
      <Router basename="/bronotify">
        <div className="flex min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8">
          <SidebarWrapper />
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="/tasks" element={<Dashboard />} />
            <Route path="/completed" element={<CompletedTasks />} />
          </Routes>
        </div>
      </Router>
    </TaskProvider>
  );
}

function SidebarWrapper() {
  const { lists, activeList, setActiveList, addList } = useContext(TaskContext);

  return (
    <div className="flex flex-col w-64 bg-gray-100 p-4 rounded-lg shadow-md h-full">
      <Sidebar
        lists={lists}
        activeList={activeList}
        setActiveList={setActiveList}
        addList={addList}
      />
    </div>
  );
}
