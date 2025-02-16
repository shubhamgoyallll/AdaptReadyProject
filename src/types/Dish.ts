export interface Dish {
  name: string;
  ingredients: string;
  diet: string;
  prep_time: string;
  cook_time: string;
  flavor_profile: string;
  course: string;
  state: string;
  region: string;
}

export interface DishFilters {
  diet?: string;
  flavor_profile?: string;
  state?: string;
  region?: string;
  course?: string;
}