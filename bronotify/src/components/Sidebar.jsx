import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaInbox, FaPlus, FaTasks, FaCheckCircle } from 'react-icons/fa';

export default function Sidebar({ lists, activeList, setActiveList, addList }) {
  const [newListName, setNewListName] = React.useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const listFromUrl = params.get('list');
    if (listFromUrl && listFromUrl !== activeList) {
      setActiveList(listFromUrl);
    }
  }, [location.search, activeList, setActiveList]);

  const handleAddList = () => {
    if (!newListName.trim()) return;
    addList(newListName.trim());
    navigate(`/tasks?list=${newListName.trim().toLowerCase().replace(/\s+/g, '-')}`);
    setNewListName('');
  };

  return (
    <div className="w-72 bg-white p-6 rounded-2xl shadow-lg flex flex-col h-full">
      <h2 className="text-2xl font-extrabold mb-6 flex items-center space-x-2 text-pink-600">
        <FaTasks /> <span>Task Lists</span>
      </h2>
      <ul className="flex-grow overflow-auto space-y-2">
        {lists.map(list => (
          <li key={list.id}>
            <Link
              to={`/tasks?list=${list.id}`}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-300 ${
                location.search.includes(list.id)
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-pink-100'
              }`}
            >
              <FaInbox className="mr-3" />
              <span className="font-semibold">{list.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex space-x-3">
        <input
          type="text"
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          placeholder="New list name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAddList(); }}
        />
        <button
          onClick={handleAddList}
          className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-5 py-3 font-bold flex items-center space-x-2 shadow-lg transition"
          aria-label="Add new list"
          title="Add new list"
        >
          <FaPlus />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
}
