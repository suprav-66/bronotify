import React, { useState, useEffect } from 'react';
import './App.css';
import { messaging } from './firebase'; // Import Firebase messaging
import { getToken, onMessage } from 'firebase/messaging';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Load tasks from localStorage on page load
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  // Register service worker for notifications
  useEffect(() => {
    // Get Firebase messaging token for push notifications
    const requestPermission = async () => {
      try {
        const currentToken = await getToken(messaging, {
          vapidKey: 'Ejss16FJXk_YViEuRCrutT5FW3En5KHgw1D__T7DGHA', // Add your VAPID Key
        });

        if (currentToken) {
          console.log('Notification token:', currentToken);
          // You can send this token to your server for later use
        } else {
          console.log('No token available');
        }
      } catch (error) {
        console.error('Error getting notification token:', error);
      }
    };

    requestPermission();
  }, []);

  // Listen for incoming messages while the app is in the foreground
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log('Message received: ', payload);
      // Display the notification
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/vite.svg', // Set your notification icon
      });
    });
  }, []);

  // Function to send a push notification (simple example)
  const sendPushNotification = (title, message) => {
    // Here, you would typically send the message to Firebase for delivery to the device
    alert(`${title}: ${message}`); // Placeholder for the push notification
  };

  // Check tasks every day at 9 PM
  useEffect(() => {
    const checkTasksAt9PM = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      
      if (hour === 21 && minute === 0 && tasks.length > 0) { // Trigger at 9 PM sharp
        new Notification('🔔 Reminder from BroNotify', {
          body: `You still have ${tasks.length} task(s) to complete.`,
          icon: '/vite.svg',
        });
      }
    };

    const intervalId = setInterval(checkTasksAt9PM, 60000); // Check every minute

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [tasks]);  // Depend on tasks, so it checks after the task list is updated

  // Add task handler
  const handleAddTask = () => {
    if (!newTask.trim()) return; // Prevent empty tasks
    const newTaskObject = { text: newTask, id: Date.now() };
    setTasks([...tasks, newTaskObject]);
    setNewTask('');

    // Send push notification when a task is added
    sendPushNotification('New Task Added', `Task: ${newTask}`);
  };

  // Delete task handler
  const handleDeleteTask = (id) => {
    const filteredTasks = tasks.filter(task => task.id !== id);
    setTasks(filteredTasks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-white mb-4">🧠 BroNotify</h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="flex mb-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            className="ml-2 bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600"
            onClick={handleAddTask}
          >
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-sm"
            >
              <span className="text-gray-800">{task.text}</span>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDeleteTask(task.id)}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
