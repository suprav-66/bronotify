import React, { createContext, useState, useEffect } from 'react';

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [lists, setLists] = useState(() => {
    const saved = localStorage.getItem('lists');
    return saved
      ? JSON.parse(saved)
      : [{ id: 'inbox', name: 'Inbox' }];
  });

  const [activeList, setActiveList] = useState(lists[0]?.id || 'inbox');

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lists', JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addList = (name) => {
    if (lists.find(l => l.name.toLowerCase() === name.toLowerCase())) return;
    const newList = { id: Date.now().toString(), name };
    setLists([...lists, newList]);
    setActiveList(newList.id);
  };

  const addTask = (text, time) => {
    if (!text.trim()) return;
    // Determine order for new task (add to end)
    const maxOrder = tasks
      .filter(t => t.listId === activeList)
      .reduce((max, t) => (t.order > max ? t.order : max), -1);
    const newTask = {
      id: Date.now().toString(),
      text: text.trim(),
      time: time || '',
      done: false,
      listId: activeList,
      order: maxOrder + 1,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleDone = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // New: Reorder tasks after drag & drop
  const reorderTasks = (newTasks) => {
    setTasks(newTasks);
  };

  return (
    <TaskContext.Provider value={{
      lists,
      activeList,
      setActiveList,
      addList,
      tasks,
      addTask,
      toggleDone,
      deleteTask,
      reorderTasks,
    }}>
      {children}
    </TaskContext.Provider>
  );
}
