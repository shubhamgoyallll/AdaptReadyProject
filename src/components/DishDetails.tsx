import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Text, Title1 } from '@fluentui/react-components';
import { dishApi } from '../api/dishApi';
import { Dish } from '../types/Dish';

const DishDetails = () => {
  const { name } = useParams<{ name: string }>();
  const [dish, setDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDish = async () => {
      try {
        if (name) {
          const data = await dishApi.getDishByName(decodeURIComponent(name));
          setDish(data);
        }
      } catch (err) {
        setError('Failed to load dish details');
      } finally {
        setLoading(false);
      }
    };

    loadDish();
  }, [name]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!dish) return <div>Dish not found</div>;

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <Title1 className="mb-4">{dish.name}</Title1>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Text className="font-semibold">Ingredients:</Text>
          <Text block>{dish.ingredients}</Text>
        </div>
        
        <div>
          <Text className="font-semibold">Diet Type:</Text>
          <Text block>{dish.diet}</Text>
        </div>
        
        <div>
          <Text className="font-semibold">Preparation Time:</Text>
          <Text block>{dish.prep_time} minutes</Text>
        </div>
        
        <div>
          <Text className="font-semibold">Cooking Time:</Text>
          <Text block>{dish.cook_time} minutes</Text>
        </div>
        
        <div>
          <Text className="font-semibold">Flavor Profile:</Text>
          <Text block>{dish.flavor_profile}</Text>
        </div>
        
        <div>
          <Text className="font-semibold">Course:</Text>
          <Text block>{dish.course}</Text>
        </div>
        
        <div>
          <Text className="font-semibold">State:</Text>
          <Text block>{dish.state}</Text>
        </div>
        
        <div>
          <Text className="font-semibold">Region:</Text>
          <Text block>{dish.region}</Text>
        </div>
      </div>
    </Card>
  );
};

export default DishDetails;