import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useSearchParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaTasks, FaTrash, FaClock } from 'react-icons/fa';

export default function Dashboard() {
  const { tasks, activeList, setActiveList, addTask, toggleDone, deleteTask, reorderTasks } = useTasks();
  const [searchParams] = useSearchParams();
  const [newTask, setNewTask] = useState('');
  const [taskTime, setTaskTime] = useState('');

  useEffect(() => {
    const listFromUrl = searchParams.get('list');
    if (listFromUrl && listFromUrl !== activeList) {
      setActiveList(listFromUrl);
    }
  }, [searchParams, activeList, setActiveList]);

  const filteredTasks = tasks
    .filter(task => task.listId === activeList)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    addTask(newTask, taskTime);
    setNewTask('');
    setTaskTime('');
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    const listTasks = filteredTasks.slice();
    const [removed] = listTasks.splice(sourceIndex, 1);
    listTasks.splice(destIndex, 0, removed);

    const newTasks = tasks.map(task => {
      if (task.listId !== activeList) return task;
      const newIndex = listTasks.findIndex(t => t.id === task.id);
      if (newIndex === -1) return task;
      return { ...task, order: newIndex };
    });

    reorderTasks(newTasks);
  };

  return (
    <div className="flex-1 ml-10 bg-white rounded-3xl shadow-2xl p-8 max-w-3xl">
      <h1 className="text-4xl font-extrabold mb-8 text-pink-600 flex items-center space-x-3">
        <FaTasks />
        <span>🧠 Bronotify</span>
      </h1>

      <div className="flex mb-6 space-x-4">
        <input
          type="text"
          placeholder="Add a new task..."
          className="flex-grow p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-300 placeholder-gray-400 text-lg transition"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); }}
        />
        <input
          type="time"
          className="w-32 p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-300 text-lg transition"
          value={taskTime}
          onChange={(e) => setTaskTime(e.target.value)}
        />
        <button
          onClick={handleAddTask}
          className="bg-pink-500 hover:bg-pink-600 text-white px-7 py-4 rounded-2xl font-bold shadow-lg transition"
        >
          Add
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasksDroppable">
          {(provided) => (
            <ul
              className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-gray-100"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredTasks.length === 0 && (
                <p className="text-center text-gray-400 text-lg italic mt-8">No tasks yet. Add one above!</p>
              )}
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      className={`flex items-center justify-between p-5 rounded-3xl shadow-md cursor-pointer transition 
                        ${task.done ? 'bg-green-100 line-through text-gray-500' : 'bg-pink-50 hover:bg-pink-100'}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        boxShadow: snapshot.isDragging ? '0 0 15px rgba(219, 39, 119, 0.5)' : 'none',
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => toggleDone(task.id)}
                          className="w-6 h-6 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className="text-lg font-semibold">{task.text}</span>
                          {task.time && (
                            <span className="flex items-center space-x-2 text-pink-500 font-mono text-sm">
                              <FaClock />
                              <span>{task.time}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700 text-2xl transition"
                        aria-label="Delete task"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
