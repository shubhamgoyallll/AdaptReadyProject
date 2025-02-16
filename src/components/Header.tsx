import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SearchBox, ISearchBoxStyles } from '@fluentui/react';
import { dishApi } from '../api/dishApi';
import { Dish } from '../types/Dish';

const searchBoxStyles: Partial<ISearchBoxStyles> = {
  root: {
    width: 300,
    margin: '0 20px'
  }
};

const Header = () => {
  const [suggestions, setSuggestions] = useState<Dish[]>([]);
  const navigate = useNavigate();

  const handleSearch = async (query: string) => {
    if (query.length >= 2) {
      const results = await dishApi.searchDishes(query);
      setSuggestions(results.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (dishName: string) => {
    navigate(`/dish/${encodeURIComponent(dishName)}`);
    setSuggestions([]);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-800">
          Indian Cuisine Explorer
        </Link>
        
        <div className="relative">
          <SearchBox
            placeholder="Search dishes, ingredients, or states..."
            onChange={(_, newValue) => handleSearch(newValue || '')}
            styles={searchBoxStyles}
          />
          
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
              {suggestions.map((dish) => (
                <div
                  key={dish.name}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(dish.name)}
                >
                  {dish.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <nav>
          <Link to="/" className="mr-4 text-gray-600 hover:text-gray-800">
            Dishes
          </Link>
          <Link to="/suggester" className="text-gray-600 hover:text-gray-800">
            Dish Suggester
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;