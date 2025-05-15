import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar({ lists, activeList, setActiveList, addList }) {
  const [newListName, setNewListName] = React.useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Sync activeList with URL query param on URL change
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

    // After adding, navigate to new list URL
    navigate(`/tasks?list=${newListName.trim().toLowerCase().replace(/\s+/g, '-')}`);

    setNewListName('');
  };

  return (
    <div className="w-64 bg-gray-100 p-4 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Task Lists</h2>
      <ul className="flex-grow overflow-auto">
        {lists.map(list => (
          <li key={list.id} className="mb-1">
            <Link
              to={`/tasks?list=${list.id}`}
              className={`block px-3 py-2 rounded ${
                location.search.includes(list.id)
                  ? 'bg-pink-500 text-white'
                  : 'hover:bg-pink-200'
              }`}
            >
              {list.name}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex space-x-2">
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded"
          placeholder="New list name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAddList(); }}
        />
        <button
          className="bg-pink-500 text-white px-3 rounded hover:bg-pink-600"
          onClick={handleAddList}
        >
          Add
        </button>
      </div>
    </div>
  );
}
