import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
 

const app = express();
app.use(cors());
app.use(express.json());



// Load dishes data
const loadDishes = async () => {
  const data = await fs.readFile(join(__dirname, 'data_file/config.json'), 'utf-8');
  return JSON.parse(data);
};

// Routes
app.get('/api/dishes', async (req, res) => {
  try {
    console.log("shubham");
    
    const dishes = await loadDishes();
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load dishes' });
  }
});
app.get('/api/dishes/search', async (req, res) => {
  try {
    console.log("shubham")
    const { q } = req.query;
    console.log("req.query",req.query)
    const dishes = await loadDishes();
    console.log("dishes",dishes);
    
    const searchResults = dishes.filter(dish => {
      const searchTerm = q.toString().toLowerCase();
      console.log("searchTerm",searchTerm);
      
      return (
        dish.name.toLowerCase().includes(searchTerm) ||
        dish.ingredients.toLowerCase().includes(searchTerm) ||
        dish.state.toLowerCase().includes(searchTerm)
      );
    });
    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search dishes' });
  }
});

app.get('/api/dishes/:name', async (req, res) => {
  try {
    const dishes = await loadDishes();
    const dish = dishes.find(d => d.name.toLowerCase() === req.params.name.toLowerCase());
    if (dish) {
      res.json(dish);
    } else {
      res.status(404).json({ error: 'Dish not found11' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to load dish' });
  }
});

app.post('/api/dishes/suggest', async (req, res) => {
  try {
    const { ingredients } = req.body;
    const dishes = await loadDishes();
    const suggestedDishes = dishes.filter(dish => {
      const dishIngredients = dish.ingredients.toLowerCase().split(',').map(i => i.trim());
      return ingredients.every(ing => 
        dishIngredients.some(di => di.includes(ing.toLowerCase()))
      );
    });
    res.json(suggestedDishes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to suggest dishes' });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});