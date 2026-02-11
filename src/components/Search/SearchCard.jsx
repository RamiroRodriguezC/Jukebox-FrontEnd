
import { Link } from 'react-router-dom';

// SearchResultCard.jsx
const SearchResultCard = ({ item, type }) => {
  // Determinamos qué mostrar según el tipo
  const title = item.titulo || item.nombre;
  const subtitle = item.entidad_info?.autor_nombre || (item.autores && item.autores[0]?.nombre) || "";
  const image = item.url_portada || item.url_perfil || "https://via.placeholder.com/150";

  return (
    <Link to={`/${type}/${item._id}`} className="search-result-link">
      <div className="search-result-card">
        <img src={image} alt={title} className="card-image" />
        <div className="card-info">
          <h4 className="card-title">{title}</h4>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      </div>
    </Link>
  );
};

export default SearchResultCard;