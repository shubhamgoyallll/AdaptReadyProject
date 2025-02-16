import axios from 'axios';
import { Dish } from '../types/Dish';

const API_URL = 'http://localhost:3000/api';

export const dishApi = {
  getAllDishes: async (): Promise<Dish[]> => {
    const response = await axios.get(`${API_URL}/dishes`);
    return response.data;
  },

  getDishByName: async (name: string): Promise<Dish> => {
    const response = await axios.get(`${API_URL}/dishes/${name}`);
    return response.data;
  },

  suggestDishes: async (ingredients: string[]): Promise<Dish[]> => {
    const response = await axios.post(`${API_URL}/dishes/suggest`, { ingredients });
    return response.data;
  },

  searchDishes: async (query: string): Promise<Dish[]> => {
    const response = await axios.get(`${API_URL}/dishes/search?q=${query}`);
    return response.data;
  }
};