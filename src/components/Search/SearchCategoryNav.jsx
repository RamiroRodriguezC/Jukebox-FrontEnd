

// SearchCategoryNav.jsx
const SearchCategoryNav = ({ activeCategory, setCategory }) => {
  const categories = ['Album', 'Cancion', 'Artista', 'Usuario'];

  return (
    <div className="search-nav">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`search-nav-item ${activeCategory === cat.toLowerCase() ? 'active' : ''}`}
          onClick={() => setCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default SearchCategoryNav;