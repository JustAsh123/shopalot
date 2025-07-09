import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useCategory } from '../context/useCategory';

export default function CategoryManager() {
  // We now expect 'categories' from useCategory to already be the structured tree
  const { categories, loading, error } = useCategory();
  const [expanded, setExpanded] = useState({});

  // Use the toggleExpand function as is
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
        Error loading categories: {error} {/* Show error message for debugging */}
      </div>
    );
  }

  return (
    <div className="text-gray-300">
      <div className="text-sm font-medium mb-2 flex items-center">
        Categories
        <span className="text-xs text-gray-500 ml-2">
          ({categories.length} total top-level) {/* Changed count to reflect top-level */}
        </span>
      </div>

      <div className="space-y-1">
        {categories.length === 0 ? (
          <div className="text-xs text-gray-500 italic">No categories yet</div>
        ) : (
          categories.map(parentCategory => ( // Iterate directly over the structured categories
            <div key={parentCategory.id}>
              <div
                className={`flex items-center py-2 px-2 rounded-sm cursor-pointer ${
                  parentCategory.subcategories && parentCategory.subcategories.length > 0 ? 'hover:bg-gray-800' : ''
                }`}
                // Condition to allow click only if it has subcategories
                onClick={() => parentCategory.subcategories && parentCategory.subcategories.length > 0 && toggleExpand(parentCategory.id)}
              >
                {parentCategory.subcategories && parentCategory.subcategories.length > 0 ? (
                  // Show Chevron if there are subcategories
                  <ChevronRight
                    className={`h-3.5 w-3.5 mr-1.5 text-gray-500 transition-transform ${
                      expanded[parentCategory.id] ? 'rotate-90' : ''
                    }`}
                  />
                ) : (
                  // Provide spacing even if no subcategories for alignment
                  <div className="w-5"></div>
                )}
                <span className="text-gray-300">{parentCategory.name}</span>
              </div>

              {expanded[parentCategory.id] && parentCategory.subcategories && parentCategory.subcategories.length > 0 && (
                <div className="ml-5 mt-1 mb-2 border-l border-gray-700 pl-3 space-y-1">
                  {parentCategory.subcategories.map(childCategory => ( // Map over subcategories
                    <div key={childCategory.id} className="flex items-center py-1.5 px-2 text-gray-400 hover:text-gray-300">
                      <span className="text-xs mr-2">-</span>
                      <span className="text-sm">{childCategory.name}</span>
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