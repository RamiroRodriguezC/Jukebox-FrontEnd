/*
En este archivo esta, no solo el componente de la propia reseña, que engloba una ReviewCard agregandole
caracteristicas adicionales, si no que tambien el componente del modal para crear/editar la reseña, 
que se llama ReviewModal y es basicamente la ventana emergente del formulario.
*/

import { useState } from 'react';
import { Star } from 'lucide-react';
import { message } from 'antd';
import ReviewCard from './ReviewCard';
import api from '../../api/api';
import './ReviewCard.css';
import './OwnReview.css';

/**
 * @param {boolean} open - controla si el modal está abierto o cerrado
 * @param {function} onClose - función para cerrar el modal, seteando open en false desde el padre
 * @param {function} onSubmit - función al enviar el formulario, recibe { rating, comentario, like }
 * @param {boolean} saving - indica si se está guardando, para mostrar estado de carga en el botón
 * @param {object|null} existing - reseña existente si se está editando, null si se está creando
 * ReviewModal es un componente que muestra una ventana emergente con un formulario para crear o editar una reseña.
 * Recibe props para controlar su estado (abierto/cerrado), manejar el envío del formulario, mostrar estado de carga, y cargar datos existentes en caso de edición.
 * El formulario incluye selección de puntuación con estrellas, un checkbox para indicar si te gustó, y un campo de texto para comentarios.
 * Al enviar el formulario, llama a onSubmit con los datos ingresados.
 */
const ReviewModal = ({ open, onClose, onSubmit, saving, existing }) => {
  const [form, setForm] = useState({
    rating:     existing?.rating     ?? 0,
    comentario: existing?.comentario ?? '',
    like:       existing?.like       ?? false,
  });

  if (!open) return null; // Si el modal no está abierto, no renderizamos nada
  // Si el modal está abierto, renderizamos el formulario dentro de una ventana emergente.
  return (
    <div className="rmodal-overlay" onClick={onClose}> {/* Si clickeas dentro de este div se cierra el modal */}
    {/* Evitamos que el clic dentro del modal cierre la ventana, asi que si clickeas dentro de este div no aplica la regla anterior */}
      <div className="rmodal-card" onClick={e => e.stopPropagation()}> {/* e: evento que se genera al clickear */}

        <div className="rmodal-header">
          <h3>{existing ? 'Editar reseña' : 'Escribir reseña'}</h3> {/* Si existe una reseña previa, el título del modal es "Editar reseña", si no, es "Escribir reseña" */}
          <button className="rmodal-close-btn" onClick={onClose}>✕</button> {/* Botón para cerrar el modal, que llama a la función onClose pasada por props */}
        </div>

        <div className="rmodal-field">
          <label>Puntuación</label>
          {/* RATING CON ESTRELLAS */}
          <div className="rmodal-stars">
            {/* Hacemos un arreglo vacio iterable (para eso el spread) de 5 lugares y segun el indice de esos elementos, generamos para cada uno
            una estrella, rellena si es menor que el rating y si no vacio.
            De esta forma si puntuamos 3 estrellas, las posiciones 0,1 y 2 tendran estrellas rellenas */}
            {[1,2,3,4,5].map(n => ( 
              <Star key={n} size={26} style={{ cursor: 'pointer' }}
                className={n <= form.rating ? 'star-filled' : 'star-empty'}
                // ...f copia todo el form tal cual, y actualizamos solo rating con el nuevo valor n, 
                // que es el numero de estrella clickeada. Asi podemos cambiar la puntuacion del form haciendo click en las estrellas.
                // cada estrella tiene su onClick que actualiza el rating del form al numero de esa estrella, asi si clickeas la estrella 4, el rating se actualiza a 4.
                onClick={() => setForm(f => ({ ...f, rating: n }))} />
            ))}
          </div>
        </div>

        <div className="rmodal-field">
          <label>
            {/* Checkbox para indicar si te gusto o no*/}
            <input type="checkbox" checked={form.like}
            // ... f copia todo el form tal cual y actualizamos solo like si se cambia la checkbox.
              onChange={e => setForm(f => ({ ...f, like: e.target.checked }))} />
            {' '}Me gustó
          </label>
        </div>

        <div className="rmodal-field">
          <label>Comentario (opcional)</label>
          <textarea className="rmodal-textarea" rows={4} value={form.comentario}
            placeholder="Contá qué te pareció..."
            // ... f copia todo el form tal cual y actualizamos solo el comentario si.
            onChange={e => setForm(f => ({ ...f, comentario: e.target.value }))} />
        </div>

        {/* Botones para cancelar o enviar el formulario. El botón de enviar se deshabilita si se está guardando o si no se seleccionó una puntuación (rating) */}
        <div className="rmodal-actions">
          <button className="btn-see-more" onClick={onClose}>Cancelar</button>
          <button className="btn-write-review" disabled={saving || !form.rating}
            onClick={() => onSubmit(form)}>
            {saving ? 'Guardando...' : existing ? 'Guardar cambios' : 'Publicar'}
          </button>
        </div>

      </div>
    </div>
  );
};

/**  
 * @param {string} userId - ID del usuario actual, necesario para crear la reseña con el autor correcto
 * @param {string} entityId - ID de la entidad (canción, álbum, etc) a la que se le hace la reseña
 * @param {string} entityType - tipo de entidad (por ejemplo "track" o "album") a la que se le hace la reseña
 * @param {object|null} ownReview - si el usuario ya tiene una reseña para esta entidad, se pasa como objeto. Si no tiene reseña, es null.
 * @param {function} onReviewChange - función que se llama cuando se crea, edita o elimina una reseña. Recibe dos argumentos: el tipo de cambio ('create', 'edit' o 'delete') y los datos relevantes (la nueva reseña creada, la reseña editada, o la reseña eliminada).
 * OwnReview es un componente que muestra la reseña del usuario actual para una entidad específica (canción, álbum, etc). Si el usuario
*/
const OwnReview = ({ userId, entityId, entityType, ownReview, onReviewChange }) => {
  const [modal, setModal]     = useState(false); //Estado que determina si se muestra la ventana emergente del formulario para crear/editar reseña
  const [editing, setEditing] = useState(null); // Estado que almacena la reseña que se está editando. Si es null, no se está editando ninguna reseña. Si tiene un objeto de reseña, ese es el que se carga en el formulario para editar. (ES EXISTING EN EL MODAL)
  const [saving, setSaving]   = useState(false); // Estado que indica si se está guardando la reseña, para mostrar un estado de carga en el botón de enviar y evitar múltiples envíos simultáneos.
  const [deleting, setDeleting] = useState(false); // Estado que indica si se está eliminando la reseña, para mostrar un estado de carga en el botón de eliminar y evitar múltiples clics simultáneos.

  const closeModal = () => { setModal(false); setEditing(null); };

  /**
   * Función para manejar la creación de una nueva reseña. Recibe los datos del formulario, hace la petición a la API para crear la reseña, y luego notifica al padre con onReviewChange para que actualice su estado.
   * @param {*} form 
   */
  const handleCreate = async (form) => {
    setSaving(true);
    try {
      // Hacemos la petición a la API para crear una nueva reseña, pasando los datos del formulario y la información necesaria para asociar la reseña con el usuario y la entidad correspondiente.
      const { data } = await api.post('/reviews/create', {
        rating: form.rating, comentario: form.comentario, like: form.like,
        entidad_tipo: entityType, entidad_id: entityId, autor_id: userId,
      });
      onReviewChange('create', data); //Le avisas al componente padre que cambio la review, para que el padre pueda actualizar su estado y mostrar la nueva reseña en la lista de reseñas.
      closeModal(); //cerras la ventana emergente
      message.success('¡Reseña publicada!'); //das mensaje de exito
    } catch (err) { //si se rompio el try, das error y mostras el mensaje.
      message.error(err.response?.data?.error || 'Error al publicar');
    } finally { setSaving(false); }
  };

    /**
   * Función para manejar la edicion de una nueva reseña. Recibe los datos del formulario, hace la petición a la API para actualizar la reseña, y luego notifica al padre con onReviewChange para que actualice su estado.
   * @param {*} form 
   */
  const handleEdit = async (form) => {
    setSaving(true);
    try {
      const { data } = await api.put(`/reviews/${ownReview._id}`, {
        rating: form.rating, comentario: form.comentario, like: form.like,
      });
      onReviewChange('edit', data); // Le avisas al componente padre que cambio la review, para que el padre pueda actualizar su estado y mostrar la reseña editada en la lista de reseñas.
      closeModal();
      message.success('Reseña actualizada');
    } catch (err) {
      message.error(err.response?.data?.error || 'Error al actualizar');
    } finally { setSaving(false); }
  };

      /**
   * Función para manejar la edicion de una nueva reseña. Recibe los datos del formulario, hace la petición a la API para actualizar la reseña, y luego notifica al padre con onReviewChange para que actualice su estado.
   * @param {*} form 
   */
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/reviews/${ownReview._id}`);
      onReviewChange('delete', ownReview);
      message.success('Reseña eliminada');
    } catch (err) {
      message.error(err.response?.data?.error || 'Error al eliminar');
    } finally { setDeleting(false); }
  };

  if (!ownReview) // Si no hay review propia, mostramos el botón para crear una
    return (
    <>
      <button className="btn-write-review" onClick={() => setModal(true)}>
        ✏️ Escribir reseña
      </button>
      {/* Modal para crear una nueva reseña, se muestra cuando modal = true */}
      <ReviewModal open={modal} onClose={closeModal} onSubmit={handleCreate} saving={saving} existing={null} />
    </>
  );

   // Si hay review propia, mostramos la review con opciones de editar/eliminar
  return (
    <>
      <div className="own-review-card">
        <div className="own-review-header">
          <span className="own-review-label">Tu reseña</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="own-review-btn" onClick={() => { setEditing(ownReview); setModal(true); }}>✏️ Editar</button>
            <button className="own-review-btn own-review-btn--danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? '...' : '🗑️ Eliminar'}
            </button>
          </div>
        </div>
        <ReviewCard review={ownReview} />
      </div>

      <ReviewModal open={modal} onClose={closeModal} onSubmit={handleEdit} saving={saving} existing={editing} />
    </>
  );
};

export default OwnReview;