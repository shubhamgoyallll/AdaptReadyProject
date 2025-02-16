import { create } from 'zustand';
import { Dish, DishFilters } from '../types/Dish';

interface DishState {
  dishes: Dish[];
  filteredDishes: Dish[];
  currentPage: number;
  itemsPerPage: number;
  filters: DishFilters;
  searchTerm: string;
  setDishes: (dishes: Dish[]) => void;
  setFilters: (filters: DishFilters) => void;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  applyFilters: () => void;
}

export const useDishStore = create<DishState>((set, get) => ({
  dishes: [],
  filteredDishes: [],
  currentPage: 1,
  itemsPerPage: 10,
  filters: {},
  searchTerm: '',

  setDishes: (dishes) => {
    set({ dishes, filteredDishes: dishes });
    get().applyFilters();
  },

  setFilters: (filters) => {
    set({ filters });
    get().applyFilters();
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().applyFilters();
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  applyFilters: () => {
    const { dishes, filters, searchTerm } = get();
    
    let filtered = [...dishes];

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(dish => 
        dish.name.toLowerCase().includes(term) ||
        dish.ingredients.toLowerCase().includes(term) ||
        dish.state.toLowerCase().includes(term)
      );
    }

    // Apply filters
    if (filters.diet) {
      filtered = filtered.filter(dish => dish.diet === filters.diet);
    }
    if (filters.flavor_profile) {
      filtered = filtered.filter(dish => dish.flavor_profile === filters.flavor_profile);
    }
    if (filters.state) {
      filtered = filtered.filter(dish => dish.state === filters.state);
    }
    if (filters.region) {
      filtered = filtered.filter(dish => dish.region === filters.region);
    }
    if (filters.course) {
      filtered = filtered.filter(dish => dish.course === filters.course);
    }

    set({ filteredDishes: filtered, currentPage: 1 });
  }
}));