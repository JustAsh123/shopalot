import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useCategory } from '../context/useCategory';

export default function CategoryManager() {
  const { categories, loading, error } = useCategory();
  const [expanded, setExpanded] = useState({});

  // Organize categories
  const { parents, childrenMap } = categories.reduce((acc, category) => {
    if (!category.parentId) {
      acc.parents.push(category);
    } else {
      if (!acc.childrenMap[category.parentId]) {
        acc.childrenMap[category.parentId] = [];
      }
      acc.childrenMap[category.parentId].push(category);
    }
    return acc;
  }, { parents: [], childrenMap: {} });

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-pulse flex space-x-4">
          <div className="h-4 w-4 bg-gray-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-xs text-gray-500 p-2">
        Error loading categories
      </div>
    );
  }

  return (
    <div className="text-gray-300">
      <div className="text-sm font-medium mb-2 flex items-center">
        Categories
        <span className="text-xs text-gray-500 ml-2">
          ({parents.length} total)
        </span>
      </div>

      <div className="space-y-1">
        {parents.length === 0 ? (
          <div className="text-xs text-gray-500 italic">No categories yet</div>
        ) : (
          parents.map(parent => (
            <div key={parent.id}>
              <div 
                className={`flex items-center py-2 px-2 rounded-sm cursor-pointer ${
                  childrenMap[parent.id] ? 'hover:bg-gray-800' : ''
                }`}
                onClick={() => childrenMap[parent.id] && toggleExpand(parent.id)}
              >
                {childrenMap[parent.id] ? (
                  <ChevronRight
                    className={`h-3.5 w-3.5 mr-1.5 text-gray-500 transition-transform ${
                      expanded[parent.id] ? 'rotate-90' : ''
                    }`}
                  />
                ) : (
                  <div className="w-5"></div>
                )}
                <span className="text-gray-300">{parent.name}</span>
              </div>

              {expanded[parent.id] && childrenMap[parent.id] && (
                <div className="ml-5 mt-1 mb-2 border-l border-gray-700 pl-3 space-y-1">
                  {childrenMap[parent.id].map(child => (
                    <div key={child.id} className="flex items-center py-1.5 px-2 text-gray-400 hover:text-gray-300">
                      <span className="text-xs mr-2">-</span>
                      <span className="text-sm">{child.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
