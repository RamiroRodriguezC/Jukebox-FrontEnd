

// SearchCategoryNav.jsx
const SearchCategoryNav = ({ activeCategory, setCategory }) => {
  const categories = ['Albums', 'Canciones', 'Artistas', 'Usuarios'];

  return (
    <div className="search-nav">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`search-nav-item ${activeCategory === cat.toLowerCase() ? 'active' : ''}`}
          onClick={() => setCategory(cat.toLowerCase())}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};