import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useSearchParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function Dashboard() {
  const { tasks, activeList, setActiveList, addTask, toggleDone, deleteTask, reorderTasks } = useTasks();
  const [searchParams] = useSearchParams();
  const [newTask, setNewTask] = useState('');
  const [taskTime, setTaskTime] = useState('');

  // Sync activeList with URL query param
  useEffect(() => {
    const listFromUrl = searchParams.get('list');
    if (listFromUrl && listFromUrl !== activeList) {
      setActiveList(listFromUrl);
    }
  }, [searchParams, activeList, setActiveList]);

  // Filter and sort tasks by order within active list
  const filteredTasks = tasks
    .filter(task => task.listId === activeList)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    addTask(newTask, taskTime);
    setNewTask('');
    setTaskTime('');
  };

  // Handle drag end event
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
    <div className="flex-1 ml-8 bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold mb-4">🧠 Tasks</h1>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Add a new task..."
          className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-400"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); }}
        />
        <input
          type="time"
          className="ml-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
          value={taskTime}
          onChange={(e) => setTaskTime(e.target.value)}
        />
        <button
          onClick={handleAddTask}
          className="ml-2 bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600"
        >
          Add
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasksDroppable">
          {(provided) => (
            <ul
              className="space-y-2 max-h-96 overflow-y-auto"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredTasks.length === 0 && (
                <p className="text-center text-gray-500 mt-4">No tasks yet. Add one above!</p>
              )}
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      className={`flex items-center justify-between p-3 rounded-lg shadow-sm
                        ${task.done ? 'bg-green-200 line-through text-gray-600' : 'bg-gray-100 text-gray-800'}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        boxShadow: snapshot.isDragging ? '0 0 10px rgba(0,0,0,0.3)' : 'none',
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={() => toggleDone(task.id)}
                          className="w-5 h-5"
                        />
                        <span>
                          {task.text}
                          {task.time && (
                            <span className="ml-2 text-sm text-gray-500">⏰ {task.time}</span>
                          )}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700 text-lg ml-2"
                        aria-label="Delete task"
                      >
                        ❌
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
