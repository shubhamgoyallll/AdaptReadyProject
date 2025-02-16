import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeIcons } from '@fluentui/react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import Header from './components/Header';
import DishList from './components/DishList';
import DishDetails from './components/DishDetails';
import DishSuggester from './components/DishSuggester';

initializeIcons();

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<DishList />} />
              <Route path="/dish/:name" element={<DishDetails />} />
              <Route path="/suggester" element={<DishSuggester />} />
            </Routes>
          </main>
        </div>
      </Router>
    </FluentProvider>
  );
}

export default App;