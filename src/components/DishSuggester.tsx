import { useState } from 'react';
import {
  Stack,
  TextField,
  PrimaryButton,
  DetailsList,
  SelectionMode,
  IColumn,
} from '@fluentui/react';
import { dishApi } from '../api/dishApi';
import { Dish } from '../types/Dish';

const DishSuggester = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [suggestedDishes, setSuggestedDishes] = useState<Dish[]>([]);

  const handleAddIngredient = () => {
    if (currentIngredient.trim()) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(ing => ing !== ingredient));
  };

  const handleSuggest = async () => {
    if (ingredients.length > 0) {
      const suggestions = await dishApi.suggestDishes(ingredients);
      setSuggestedDishes(suggestions);
    }
  };

  const columns: IColumn[] = [
    {
      key: 'name',
      name: 'Name',
      fieldName: 'name',
      minWidth: 100,
    },
    {
      key: 'ingredients',
      name: 'Ingredients',
      fieldName: 'ingredients',
      minWidth: 200,
    },
    {
      key: 'prep_time',
      name: 'Prep Time (min)',
      fieldName: 'prep_time',
      minWidth: 100,
    },
    {
      key: 'cook_time',
      name: 'Cook Time (min)',
      fieldName: 'cook_time',
      minWidth: 100,
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Stack tokens={{ childrenGap: 20 }}>
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <TextField
            value={currentIngredient}
            onChange={(_, newValue) => setCurrentIngredient(newValue || '')}
            placeholder="Enter an ingredient"
            className="flex-grow"
          />
          <PrimaryButton text="Add" onClick={handleAddIngredient} />
        </Stack>

        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient}
              className="bg-blue-100 px-3 py-1 rounded-full flex items-center"
            >
              <span>{ingredient}</span>
              <button
                onClick={() => handleRemoveIngredient(ingredient)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <PrimaryButton
          text="Find Possible Dishes"
          onClick={handleSuggest}
          disabled={ingredients.length === 0}
        />

        {suggestedDishes.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Suggested Dishes</h2>
            <DetailsList
              items={suggestedDishes}
              columns={columns}
              selectionMode={SelectionMode.none}
            />
          </div>
        )}
      </Stack>
    </div>
  );
};

export default DishSuggester;