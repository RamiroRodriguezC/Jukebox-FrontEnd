// SearchBar.jsx
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