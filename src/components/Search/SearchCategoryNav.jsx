const SearchCategoryNav = ({ activeCategory, setCategory }) => {
  const categories = ['Album', 'Cancion', 'Artista', 'Usuario'];

  return (
    <div className="search-nav">
      {categories.map((cat) => {
        // Comparamos de forma segura para la interfaz
        const isSelected = activeCategory === cat; 

        return (
          <button
            key={cat}
            // La clase 'active' se queda porque isSelected será True
            className={`search-nav-item ${isSelected ? 'active' : ''}`}
            // Enviamos la palabra con Mayúscula para que el servidor no falle
            onClick={() => setCategory(cat)} 
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default SearchCategoryNav;