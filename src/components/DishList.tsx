import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DetailsList,
  SelectionMode,
  IColumn,
  Dropdown,
  Stack,
  StackItem,
  PrimaryButton,
  Spinner
} from '@fluentui/react';
import { dishApi } from '../api/dishApi';
import { useDishStore } from '../store/dishStore';

const DishList = () => {
  const { 
    filteredDishes,
    currentPage,
    itemsPerPage,
    filters,
    setDishes,
    setFilters,
    setCurrentPage 
  } = useDishStore();

  const [uniqueValues, setUniqueValues] = useState({
    diets: new Set(),
    flavors: new Set(),
    states: new Set(),
    regions: new Set(),
    courses: new Set()
  });

  const [loading, setLoading] = useState(true);
  const [sortedColumn, setSortedColumn] = useState<IColumn | null>(null);
  const [isSortedDescending, setIsSortedDescending] = useState(false);

  useEffect(() => {
    const loadDishes = async () => {
      try {
        const data = await dishApi.getAllDishes();
        setDishes(data);
        
        const values = {
          diets: new Set(data.map(d => d.diet)),
          flavors: new Set(data.map(d => d.flavor_profile)),
          states: new Set(data.map(d => d.state)),
          regions: new Set(data.map(d => d.region)),
          courses: new Set(data.map(d => d.course))
        };
        setUniqueValues(values);
      } catch (error) {
        console.error('Failed to load dishes', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDishes();
  }, []);

  const columns: IColumn[] = [
    {
      key: 'name',
      name: 'Name',
      fieldName: 'name',
      minWidth: 120,
      maxWidth: 250,
      onRender: (item) => (
        <Link to={`/dish/${encodeURIComponent(item.name)}`} className="text-blue-600 hover:text-blue-800 font-semibold">
          {item.name}
        </Link>
      ),
      isSorted: sortedColumn?.key === 'name',
      isSortedDescending: sortedColumn?.key === 'name' && isSortedDescending,
      onColumnClick: () => handleColumnClick('name')
    },
    { 
      key: 'diet', 
      name: 'Diet', 
      fieldName: 'diet', 
      minWidth: 80, 
      maxWidth: 100,
      isSorted: sortedColumn?.key === 'diet',
      isSortedDescending: sortedColumn?.key === 'diet' && isSortedDescending,
      onColumnClick: () => handleColumnClick('diet')
    },
    { 
      key: 'prep_time', 
      name: 'Prep Time', 
      fieldName: 'prep_time', 
      minWidth: 80, 
      maxWidth: 100,
      isSorted: sortedColumn?.key === 'prep_time',
      isSortedDescending: sortedColumn?.key === 'prep_time' && isSortedDescending,
      onColumnClick: () => handleColumnClick('prep_time')
    },
    { 
      key: 'cook_time', 
      name: 'Cook Time', 
      fieldName: 'cook_time', 
      minWidth: 80, 
      maxWidth: 100,
      isSorted: sortedColumn?.key === 'cook_time',
      isSortedDescending: sortedColumn?.key === 'cook_time' && isSortedDescending,
      onColumnClick: () => handleColumnClick('cook_time')
    },
    { 
      key: 'flavor_profile', 
      name: 'Flavor', 
      fieldName: 'flavor_profile', 
      minWidth: 80, 
      maxWidth: 100,
      isSorted: sortedColumn?.key === 'flavor_profile',
      isSortedDescending: sortedColumn?.key === 'flavor_profile' && isSortedDescending,
      onColumnClick: () => handleColumnClick('flavor_profile')
    },
    { 
      key: 'course', 
      name: 'Course', 
      fieldName: 'course', 
      minWidth: 100, 
      maxWidth: 140,
      isSorted: sortedColumn?.key === 'course',
      isSortedDescending: sortedColumn?.key === 'course' && isSortedDescending,
      onColumnClick: () => handleColumnClick('course')
    },
    { 
      key: 'state', 
      name: 'State', 
      fieldName: 'state', 
      minWidth: 100, 
      maxWidth: 150,
      isSorted: sortedColumn?.key === 'state',
      isSortedDescending: sortedColumn?.key === 'state' && isSortedDescending,
      onColumnClick: () => handleColumnClick('state')
    },
    { 
      key: 'region', 
      name: 'Region', 
      fieldName: 'region', 
      minWidth: 80, 
      maxWidth: 100,
      isSorted: sortedColumn?.key === 'region',
      isSortedDescending: sortedColumn?.key === 'region' && isSortedDescending,
      onColumnClick: () => handleColumnClick('region')
    }
  ];

  const handleColumnClick = (columnKey: string) => {
    if (sortedColumn?.key === columnKey) {
      setIsSortedDescending(!isSortedDescending);
    } else {
      setSortedColumn(columns.find(col => col.key === columnKey) || null);
      setIsSortedDescending(false);
    }
  };

  const createDropdownOptions = (values) => {
    return Array.from(values).map(value => ({ key: value, text: value }));
  };

  const clearFilters = () => {
    setFilters({ diet: '', flavor_profile: '', state: '' });
  };

  // Filter out rows with negative values in any of the specified columns
  const filteredDishesWithoutNegatives = filteredDishes.filter(dish => 
    dish.prep_time >= 0 &&
    dish.cook_time >= 0 &&
    dish.flavor_profile !== '-' &&
    dish.course !== '-' &&
    dish.state !== '-' &&
    dish.diet !== '-'
  );

  const sortedDishes = sortedColumn ? [...filteredDishesWithoutNegatives].sort((a, b) => {
    const aValue = a[sortedColumn.fieldName || ''];
    const bValue = b[sortedColumn.fieldName || ''];
    if (aValue < bValue) return isSortedDescending ? 1 : -1;
    if (aValue > bValue) return isSortedDescending ? -1 : 1;
    return 0;
  }) : filteredDishesWithoutNegatives;

  const paginatedDishes = sortedDishes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pageCount = Math.ceil(sortedDishes.length / itemsPerPage);

  return (
    <div className="space-y-6 p-4">
      {loading ? (
        <Spinner label="Loading dishes..." size={3} />
      ) : (
        <>
          {/* Filters */}
          <Stack horizontal tokens={{ childrenGap: 20 }} className="mb-4">
            <StackItem styles={{ root: { width: 200 } }}>
              <Dropdown
                placeholder="Select Diet"
                options={createDropdownOptions(uniqueValues.diets).filter(opt => opt.key && opt.key !== "-")}
                selectedKey={filters.diet || ''}
                onChange={(_, option) => setFilters({ ...filters, diet: option?.key })}
              />
            </StackItem>
            <StackItem styles={{ root: { width: 200 } }}>
              <Dropdown
                placeholder="Select Flavor"
                options={createDropdownOptions(uniqueValues.flavors).filter(opt => opt.key && opt.key !== "-")}
                selectedKey={filters.flavor_profile || ''}
                onChange={(_, option) => setFilters({ ...filters, flavor_profile: option?.key })}
              />
            </StackItem>
            <StackItem styles={{ root: { width: 200 } }}>
              <Dropdown
                placeholder="Select State"
                options={createDropdownOptions(uniqueValues.states).filter(opt => opt.key && opt.key !== "-")}
                selectedKey={filters.state || ''}
                onChange={(_, option) => setFilters({ ...filters, state: option?.key })}
              />
            </StackItem>
            <StackItem>
              <PrimaryButton text="Clear Filters" onClick={clearFilters} />
            </StackItem>
          </Stack>

          
          {/* Dish List */}
          <DetailsList
            items={paginatedDishes}
            columns={columns}
            selectionMode={SelectionMode.none}
            setKey="set"
            layoutMode={1}
            onColumnHeaderClick={(_, column) => column.onColumnClick?.()}
          />

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2 items-center">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md transition-all ${
                currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              &larr; Prev
            </button>

            {/* Current and Next Page Numbers */}
            {pageCount > 1 && (
              <>
                <button
                  onClick={() => setCurrentPage(1)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    currentPage === 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  1
                </button>
                
                {currentPage > 2 && <span className="px-2">...</span>}

                {currentPage > 1 && currentPage < pageCount && (
                  <button className="px-3 py-1 rounded-md bg-blue-600 text-white shadow-md">
                    {currentPage}
                  </button>
                )}

                {currentPage < pageCount - 1 && <span className="px-2">...</span>}

                <button
                  onClick={() => setCurrentPage(pageCount)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    currentPage === pageCount ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageCount}
                </button>
              </>
            )}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(Math.min(pageCount, currentPage + 1))}
              disabled={currentPage === pageCount}
              className={`px-3 py-1 rounded-md transition-all ${
                currentPage === pageCount ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DishList;