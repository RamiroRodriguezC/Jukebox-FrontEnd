// SearchPage.jsx
import { useState, useEffect } from 'react';
import SearchBar from '../../components/Search/SearchBar';
import SearchCategoryNav from '../../components/Search/SearchCategoryNav';
import SearchResultCard from '../../components/Search/SearchCard';
import './Search.css';
import api from '../../api/api.js';

/* ─── Página de búsqueda ───
  Esta página permite a los usuarios buscar álbumes, canciones o artistas. 
  Incluye una barra de búsqueda y una navegación para seleccionar la categoría de búsqueda. 
  Los resultados se muestran en tarjetas debajo de la barra de búsqueda.
*/
const SearchPage = () => {
  const [query, setQuery] = useState(''); // Estado para almacenar el texto de búsqueda ingresado por el usuario
  const [category, setCategory] = useState('Album'); // Estado para almacenar la categoría seleccionada (Album, Cancion o Artista)
  const [results, setResults] = useState([]); // Estado para almacenar los resultados de la búsqueda obtenidos del servidor

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 1) {
        const response = await api.get(`/search?q=${query}&type=${category}`);
        setResults(response.data);
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