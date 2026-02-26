// SearchBar.jsx
/**
 * 
 * @param {string} query - El valor actual del input de búsqueda, controlado por el estado del componente padre.
 * @param {function} setQuery - Función para actualizar el estado de la query en el componente padre cada vez que el usuario escribe algo en el input.
 * @returns 
 */
const SearchBar = ({ query, setQuery }) => {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Busca álbumes, canciones o artistas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
        autoFocus
      />
    </div>
  );
};

export default SearchBar;