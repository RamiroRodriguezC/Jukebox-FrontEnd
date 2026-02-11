// SearchPage.jsx
import { useState, useEffect } from 'react';
import SearchBar from '../../components/Search/SearchBar';
import SearchCategoryNav from '../../components/Search/SearchCategoryNav';
import SearchResultCard from '../../components/Search/SearchCard';
import './Search.css';

const API_URL = 'https://jukebox-rpt0.onrender.com'; 

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Album');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 1) {
        const response = await fetch(`${API_URL}/search?q=${query}&type=${category}`);
        const data = await response.json();
        setResults(data);
      } else {
        setResults([]);
      }
    }, 300); // Debounce para no saturar el server

    return () => clearTimeout(timer);
  }, [query, category]);

  return (
    <div className="search-page-container">
      <SearchCategoryNav activeCategory={category} setCategory={setCategory} />
      <SearchBar query={query} setQuery={setQuery} />
      
      <div className="results-list">
        {results.map((item) => (
          <SearchResultCard key={item._id} item={item} type={category} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;