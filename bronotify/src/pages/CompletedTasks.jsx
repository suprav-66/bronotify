import React from 'react';
import { useTasks } from '../hooks/useTasks';

export default function CompletedTasks() {
  const { tasks, toggleDone } = useTasks();

  const completedTasks = tasks.filter(task => task.done);

  return (
    <div className="flex-1 ml-8 bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold mb-4">✅ Completed Tasks</h1>

      {completedTasks.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No completed tasks yet.</p>
      ) : (
        <ul className="space-y-2 max-h-96 overflow-y-auto">
          {completedTasks.map(task => (
            <li
              key={task.id}
              className="flex items-center justify-between p-3 rounded-lg shadow-sm bg-green-200 line-through text-gray-600"
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(task.id)}
                  className="w-5 h-5"
                />
                <span>{task.text}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
