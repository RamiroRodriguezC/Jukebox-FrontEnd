import { useState, useEffect, useContext } from 'react';
import { message } from 'antd';
import { AuthContext } from '../../../context/AuthContext';
import api from '../../../api/api';
import genericAlbum from '../../../assets/genericAlbum.png';
import '../../../styles/Ui.css';


/* ─────────────────────────────────────────────
   HELPER: getListId
   Dado el objeto del usuario y el tab activo ('album' o 'song'),
   devuelve el _id de la lista de favoritos correspondiente.
   
   El usuario tiene en su objeto:
     user.lists.favoriteAlbums  → lista de álbumes favoritos
     user.lists.favoriteSongs   → lista de canciones favoritas
   
   Cada una puede venir como objeto populado { _id, items, ... }
   o solo como el id string directamente, por eso el doble fallback:
     lista?._id || lista
───────────────────────────────────────────── */
const getListId = (userData, tab) =>
  tab === 'album'
    ? userData?.lists?.favoriteAlbums?._id || userData?.lists?.favoriteAlbums
    : userData?.lists?.favoriteSongs?._id  || userData?.lists?.favoriteSongs;


/* ─────────────────────────────────────────────
   COMPONENTE: SearchResult
   Muestra una fila de resultado de búsqueda con imagen, título y autores.
   
   Props:
   - result     : objeto del álbum o canción devuelto por la API de búsqueda
   - type       : 'album' | 'song' — determina de dónde sacar la imagen
   - onAdd      : función a llamar cuando el usuario hace clic para agregar
   - alreadyIn  : boolean — si ya está en favoritos, se deshabilita el botón
                  y se muestra un ✓ en lugar de "+ Agregar"
───────────────────────────────────────────── */
const SearchResult = ({ result, type, onAdd, alreadyIn }) => (
  <button
    className={`fav-search-row ${alreadyIn ? 'fav-search-row--added' : ''}`}
    onClick={() => !alreadyIn && onAdd(result)}
    disabled={alreadyIn}
  >
    {/*
      La imagen de portada viene en distintos campos según el tipo:
      - Álbum:   result.url_portada
      - Canción: result.album.url_portada  (la portada del álbum al que pertenece)
      Si ninguno existe, usamos la imagen genérica. onError como fallback extra.
    */}
    <img
      src={type === 'album' ? (result.url_portada || genericAlbum) : (result.album?.url_portada || genericAlbum)}
      alt={result.titulo}
      className="fav-search-row__img"
      onError={e => { e.target.src = genericAlbum; }}
    />
    <div className="fav-search-row__info">
      <span className="fav-search-row__title">{result.titulo}</span>
      {/* Autores: array de objetos { nombre, ... }, los unimos con coma */}
      <span className="fav-search-row__sub">{result.autores?.map(a => a.nombre).join(', ')}</span>
    </div>
    <span className="fav-search-row__action">
      {alreadyIn ? '✓' : '+ Agregar'}
    </span>
  </button>
);


/* ─────────────────────────────────────────────
   COMPONENTE: EditableList
   Muestra la lista actual de favoritos del usuario.
   Cada ítem tiene número de posición, imagen, título y botón de eliminar.
   
   Props:
   - items    : array de ítems favoritos guardados
   - onRemove : función que recibe el _id del ítem a eliminar
───────────────────────────────────────────── */
const EditableList = ({ items, onRemove }) => {
  // Si no hay ítems, mostramos un mensaje vacío
  if (items.length === 0)
    return <p className="fav-empty">Sin favoritos todavía. Buscá abajo para agregar.</p>;

  return (
    <div className="fav-edit-list">
      {items.map((item, i) => (
        <div key={item.deezer_id || item._id} className="fav-edit-item">
          {/* Posición en la lista (1-based) */}
          <span className="fav-edit-item__rank">{i + 1}</span>
          <img
            src={item.url_miniatura || genericAlbum}
            alt={item.titulo}
            className="fav-edit-item__img"
            onError={e => { e.target.src = genericAlbum; }}
          />
          <span className="fav-edit-item__title">{item.titulo}</span>
          {/* Al hacer clic en ✕ se llama onRemove con el _id del ítem */}
          <button className="fav-edit-item__remove" onClick={() => onRemove(item.deezer_id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};


/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL: FavoritesSection
   
   Permite al usuario ver, agregar y eliminar sus favoritos,
   tanto de álbumes como de canciones (máximo MAX por lista).
   
   Flujo general:
   1. Al montar (o al cambiar de tab), carga los favoritos del usuario desde la API.
   2. El usuario puede buscar álbumes/canciones con un input con debounce.
   3. Al hacer clic en un resultado, se agrega a la lista vía API y se actualiza el estado local.
   4. Al hacer clic en ✕ de un ítem, se elimina vía API y se actualiza el estado local.
───────────────────────────────────────────── */
const FavoritesSection = () => {
  // Obtenemos el usuario autenticado del contexto global
  const { user } = useContext(AuthContext);

  // tab: controla qué lista se está viendo/editando ('album' | 'song')
  const [tab, setTab]         = useState('album');

  // items: array de favoritos actuales de la lista activa
  const [items, setItems]     = useState([]);

  // listId: el _id de la lista en la base de datos (favoriteAlbums o favoriteSongs)
  // necesario para las peticiones de agregar/eliminar
  const [listId, setListId]   = useState(null);

  // loading: true mientras se cargan los datos iniciales
  const [loading, setLoading] = useState(true);

  // query: texto del input de búsqueda
  const [query, setQuery]         = useState('');

  // results: array de resultados devueltos por la API de búsqueda
  const [results, setResults]     = useState([]);

  // searching: true mientras se está esperando respuesta de la búsqueda
  const [searching, setSearching] = useState(false);

  // userId: compatible con ambas formas que puede venir el id del usuario
  const userId = user?._id || user?.id;

  // Máximo de favoritos permitidos por lista
  const MAX = 4;


  /* ── Efecto: cargar lista al montar o cambiar de tab ──
     Cada vez que cambia el tab (álbumes ↔ canciones) o el userId,
     pedimos los datos frescos del usuario a la API y actualizamos
     el listId y los items con lo que devuelve el servidor.
  */
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setQuery('');      // Limpiamos la búsqueda al cambiar de tab
    setResults([]);

    api.get(`/usuarios/${userId}`)
      .then(({ data }) => {
        // Seleccionamos el campo correcto según el tab activo
        const listField = tab === 'album' ? 'favoriteAlbums' : 'favoriteSongs';
        const lista     = data?.lists?.[listField];

        // Guardamos el id de la lista para usarlo en add/remove
        setListId(lista?._id || getListId(user, tab));

        // Guardamos los ítems de la lista (o array vacío si no tiene)
        setItems(lista?.items || []);
      })
      .catch(() => message.error('No se pudo cargar la lista'))
      .finally(() => setLoading(false));
  }, [tab, userId]);


  /* ── Efecto: búsqueda con debounce ──
     Cada vez que el usuario escribe en el input, esperamos 350ms
     antes de hacer la petición. Si el usuario sigue escribiendo,
     se cancela el timer anterior (clearTimeout) y se inicia uno nuevo.
     Esto evita hacer una petición por cada tecla presionada.
  */
  useEffect(() => {
    // Si el input está vacío, limpiamos resultados y no buscamos
    if (!query.trim()) { setResults([]); return; }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        // El tipo debe coincidir con lo que espera la API ('Album' | 'Cancion')
        const type = tab === 'album' ? 'Album' : 'Cancion';
        const { data } = await api.get(`/search?q=${encodeURIComponent(query)}&type=${type}`);
        setResults(data || []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    // Cleanup: cancelar el timer si el usuario sigue escribiendo
    return () => clearTimeout(timer);
  }, [query, tab]);


  /* ── handleAdd: agregar un ítem a favoritos ──
     Recibe el objeto completo del resultado de búsqueda.
     Construimos un objeto reducido con solo los campos que guarda la lista,
     lo mandamos a la API y si tiene éxito lo agregamos al estado local
     (para no tener que volver a fetchear toda la lista).
  */
  const handleAdd = async (result) => {
    if (!listId) { message.error('Lista no encontrada'); return; }
    if (items.length >= MAX) { message.warning(`Máximo ${MAX} favoritos`); return; }


    // Armamos el ítem con solo los campos necesarios para guardar en la lista
    const item = {
      deezer_id:     result._id,
      titulo:        result.titulo,
      url_miniatura: tab === 'album' ? result.url_portada : result.album?.url_portada,
    };

    try {
      // El interceptor de axios (api.js) agrega el token automáticamente — no hace falta pasarlo acá
      await api.post(`/listas/${listId}/addItem`, item);
      // Actualizamos el estado local sin refetchear
      setItems(prev => [...prev, item]);
      message.success(`"${item.titulo}" agregado`);
    } catch (err) {
      message.error(err.response?.data?.message || 'Error al agregar');
    }
  };


  /* ── handleRemove: eliminar un ítem de favoritos ──
     Recibe el _id del ítem a eliminar.
     Hace la petición DELETE a la API y si tiene éxito
     filtra el ítem del estado local.
  */
  const handleRemove = async (itemId) => {
    try {
      // El interceptor de axios (api.js) agrega el token automáticamente — no hace falta pasarlo acá
      await api.delete(`/listas/${listId}/items/${itemId}`);
      setItems(prev => prev.filter(i => { const id = i.deezer_id ?? i._id; return String(id) !== String(itemId); }));
      message.success('Eliminado de favoritos');
    } catch (err) {
      message.error(err.response?.data?.message || 'Error al eliminar');
    }
  };

  /*
    itemIds: Set con los _id (como strings) de los ítems actuales.
    Se usa para saber rápidamente si un resultado de búsqueda ya está
    en favoritos (alreadyIn), sin tener que recorrer el array cada vez.
  */
  const itemIds = new Set(items.map(i => String(i.deezer_id ?? i._id)));

  return (
    <div className="settings-section">
      <h2 className="section-title">Favoritos</h2>
      <p className="section-subtitle">Editá tus álbumes y canciones favoritos.</p>

      {/* ── Tabs para cambiar entre álbumes y canciones ── */}
      <div className="fav-tabs">
        <button className={`fav-tab ${tab === 'album' ? 'fav-tab--active' : ''}`} onClick={() => setTab('album')}>
          🎵 Álbumes
        </button>
        <button className={`fav-tab ${tab === 'song'  ? 'fav-tab--active' : ''}`} onClick={() => setTab('song')}>
          🎤 Canciones
        </button>
      </div>

      {/* ── Lista editable: muestra los favoritos actuales ──
          Mientras carga mostramos "Cargando...", luego el componente EditableList
      */}
      {loading
        ? <p className="fav-empty">Cargando...</p>
        : <EditableList items={items} onRemove={handleRemove} />
      }

      {/* ── Buscador: solo se muestra si la lista no está llena ── */}
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

          {/* Indicador de búsqueda en progreso */}
          {searching && <p className="fav-empty">Buscando...</p>}

          {/* Resultados de búsqueda */}
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

          {/* Mensaje de sin resultados: solo si terminó de buscar y no hay nada */}
          {!searching && query.trim() && results.length === 0 && (
            <p className="fav-empty">Sin resultados para "{query}"</p>
          )}
        </div>
      )}

      {/* Mensaje cuando la lista ya está llena */}
      {!loading && items.length >= MAX && (
        <p className="fav-max-msg">✓ Lista completa. Eliminá un ítem para agregar otro.</p>
      )}
    </div>
  );
};

export default FavoritesSection;