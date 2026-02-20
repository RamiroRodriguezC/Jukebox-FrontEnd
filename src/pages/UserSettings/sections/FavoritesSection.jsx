import { useState, useEffect, useContext } from 'react';
import { message } from 'antd';
import { AuthContext } from '../../../context/AuthContext';
import api from '../../../api/api';
import genericAlbum from '../../../assets/genericAlbum.png';
import '../../../styles/forms.css';


/* ─── helpers ─── */
const getListId = (userData, tab) =>
  tab === 'album'
    ? userData?.lists?.favoriteAlbums?._id || userData?.lists?.favoriteAlbums
    : userData?.lists?.favoriteSongs?._id  || userData?.lists?.favoriteSongs;

/* ─── Resultado de búsqueda ─── */
const SearchResult = ({ result, type, onAdd, alreadyIn }) => (
  <button
    className={`fav-search-row ${alreadyIn ? 'fav-search-row--added' : ''}`}
    onClick={() => !alreadyIn && onAdd(result)}
    disabled={alreadyIn}
  >
    <img
      src={type === 'album' ? (result.url_portada || genericAlbum) : (result.album?.url_portada || genericAlbum)}
      alt={result.titulo}
      className="fav-search-row__img"
      onError={e => { e.target.src = genericAlbum; }}
    />
    <div className="fav-search-row__info">
      <span className="fav-search-row__title">{result.titulo}</span>
      <span className="fav-search-row__sub">{result.autores?.map(a => a.nombre).join(', ')}</span>
    </div>
    <span className="fav-search-row__action">
      {alreadyIn ? '✓' : '+ Agregar'}
    </span>
  </button>
);

/* ─── Lista editable (ítems con botón eliminar) ─── */
const EditableList = ({ items, onRemove }) => {
  if (items.length === 0)
    return <p className="fav-empty">Sin favoritos todavía. Buscá abajo para agregar.</p>;

  return (
    <div className="fav-edit-list">
      {items.map((item, i) => (
        <div key={item._id} className="fav-edit-item">
          <span className="fav-edit-item__rank">{i + 1}</span>
          <img
            src={item.url_miniatura || genericAlbum}
            alt={item.titulo}
            className="fav-edit-item__img"
            onError={e => { e.target.src = genericAlbum; }}
          />
          <span className="fav-edit-item__title">{item.titulo}</span>
          <button className="fav-edit-item__remove" onClick={() => onRemove(item._id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

/* ─── Componente principal ─── */
const FavoritesSection = () => {
  const { user } = useContext(AuthContext);
  const [tab, setTab]         = useState('album');
  const [items, setItems]     = useState([]);
  const [listId, setListId]   = useState(null);
  const [loading, setLoading] = useState(true);

  const [query, setQuery]         = useState('');
  const [results, setResults]     = useState([]);
  const [searching, setSearching] = useState(false);

  const userId = user?._id || user?.id;
  const MAX = 4;

  /* ── Cargar lista ── */
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setQuery('');
    setResults([]);

    api.get(`/usuarios/${userId}`)
      .then(({ data }) => {
        const listField = tab === 'album' ? 'favoriteAlbums' : 'favoriteSongs';
        const lista     = data?.lists?.[listField];
        setListId(lista?._id || getListId(user, tab));
        setItems(lista?.items || []);
      })
      .catch(() => message.error('No se pudo cargar la lista'))
      .finally(() => setLoading(false));
  }, [tab, userId]);

  /* ── Búsqueda con debounce ── */
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const type = tab === 'album' ? 'Album' : 'Cancion';
        const { data } = await api.get(`/search?q=${encodeURIComponent(query)}&type=${type}`);
        setResults(data || []);
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 350);
    return () => clearTimeout(timer);
  }, [query, tab]);

  /* ── Agregar ── */
  const handleAdd = async (result) => {
    if (!listId) { message.error('Lista no encontrada'); return; }
    if (items.length >= MAX) { message.warning(`Máximo ${MAX} favoritos`); return; }

    const token = localStorage.getItem('token');
    const item  = {
      _id:           result._id,
      titulo:        result.titulo,
      url_miniatura: tab === 'album' ? result.url_portada : result.album?.url_portada,
    };

    try {
      await api.post(`/listas/${listId}/addItem`, item, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => [...prev, item]);
      message.success(`"${item.titulo}" agregado`);
    } catch (err) {
      message.error(err.response?.data?.message || 'Error al agregar');
    }
  };

  /* ── Eliminar ── */
  const handleRemove = async (itemId) => {
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/listas/${listId}/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => prev.filter(i => i._id !== itemId));
      message.success('Eliminado de favoritos');
    } catch (err) {
      message.error(err.response?.data?.message || 'Error al eliminar');
    }
  };

  const itemIds = new Set(items.map(i => String(i._id)));

  return (
    <div className="settings-section">
      <h2 className="section-title">Favoritos</h2>
      <p className="section-subtitle">Editá tus álbumes y canciones favoritos.</p>

      {/* Tabs */}
      <div className="fav-tabs">
        <button className={`fav-tab ${tab === 'album' ? 'fav-tab--active' : ''}`} onClick={() => setTab('album')}>
          🎵 Álbumes
        </button>
        <button className={`fav-tab ${tab === 'song'  ? 'fav-tab--active' : ''}`} onClick={() => setTab('song')}>
          🎤 Canciones
        </button>
      </div>

      {/* Lista editable */}
      {loading
        ? <p className="fav-empty">Cargando...</p>
        : <EditableList items={items} onRemove={handleRemove} />
      }

      {/* Buscador — solo si hay lugar */}
      {!loading && items.length < MAX && (
        <div className="fav-search-section">
          <p className="fav-list-label">
            Agregar {tab === 'album' ? 'álbum' : 'canción'} ({items.length}/{MAX})
          </p>
          <input
            className="form-input"
            placeholder={`Buscá un ${tab === 'album' ? 'álbum' : 'canción'}...`}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />

          {searching && <p className="fav-empty">Buscando...</p>}

          {results.length > 0 && (
            <div className="fav-results">
              {results.map(r => (
                <SearchResult
                  key={r._id}
                  result={r}
                  type={tab}
                  onAdd={handleAdd}
                  alreadyIn={itemIds.has(String(r._id))}
                />
              ))}
            </div>
          )}

          {!searching && query.trim() && results.length === 0 && (
            <p className="fav-empty">Sin resultados para "{query}"</p>
          )}
        </div>
      )}

      {!loading && items.length >= MAX && (
        <p className="fav-max-msg">✓ Lista completa. Eliminá un ítem para agregar otro.</p>
      )}
    </div>
  );
};

export default FavoritesSection;