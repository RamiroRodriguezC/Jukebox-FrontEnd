/*
  Este componente representa una tarjeta de reseña, mostrando el autor, su foto, la calificación en estrellas, 
  el comentario y un botón de eliminar si el usuario es admin.
  Recibe la reseña como prop, y una función onDelete para notificar al padre cuando se elimina la reseña.
*/

import React, { useContext, useState } from 'react';
import { Star, Heart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api/api';
import './ReviewCard.css';

const ReviewCard = ({ review, onDelete }) => {
  const { user } = useContext(AuthContext); // "escucho" el contexto de autenticación para saber quién es el usuario actual y si es admin
  const isAdmin = user?.rol === 'admin';    // variable booleana que indica si el usuario es admin, para mostrar el botón de eliminar solo a admins
  const [deleting, setDeleting] = useState(false); // estado local para controlar si se está eliminando la reseña, para deshabilitar el botón mientras se procesa la eliminación

  // Función para manejar la eliminación de la reseña. Muestra una confirmación, 
  // luego hace la petición a la API para eliminarla, y finalmente notifica al padre con onDelete.
  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar esta reseña?')) return; // Confirmación antes de eliminar
    setDeleting(true); // Si se confirma, ponemos el estado de deleting en true para deshabilitar el botón
    try {
      await api.delete(`/reviews/${review._id}`); // Hacemos la petición a la API para eliminar la reseña usando su ID
      message.success('Reseña eliminada');        
      onDelete?.(review._id); // Notificamos al componente padre que la reseña fue eliminada, pasando su ID para que el padre pueda actualizar su estado y eliminarla de la lista
    } catch (err) {
      // Tratamos de mostrar el error específico que venga de la API, pero si no está disponible mostramos un mensaje genérico
      message.error(err.response?.data?.error || 'Error al eliminar');
    } finally {
      setDeleting(false); //cuanto termina la operacion ponemos isDeleting de nuevo en false
    }
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <img
            // Si el autor de la reseña tiene una foto de perfil, la mostramos. Si no, usamos un servicio de avatares que genera una imagen con las iniciales del nombre de usuario y un fondo de color aleatorio. 
            src={review.autor.url_profile_photo || `https://ui-avatars.com/api/?name=${review.autor.username}&background=random`}
            className="reviewer-avatar"
            alt="avatar"
          />
          <Link to={`/Usuario/${review.autor._id}`} className="reviewer-name">
            <span className="reviewer-name">{review.autor.username}</span>
          </Link>
        </div>
        <div className="reviewer-info">
          {/* Mostramos un corazón lleno si el usuario indico que le gusta la cancion/albun en su reseña, si no vacio*/}
          <Heart size={12} className={review.like ? 'heart-filled' : 'text-gray-600'} />
          <div className="review-stars">
            {/* Hacemos un arreglo vacio iterable (para eso el spread) de 5 lugares y segun el indice de esos elementos, generamos para cada uno
            una estrella, rellena si es menor que el rating y si no vacio.
            De esta forma si puntuamos 3 estrellas, las posiciones 0,1 y 2 tendran estrellas rellenas */}
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < review.rating ? 'star-filled' : 'text-gray-600'} />
            ))}
          </div>
          {isAdmin && (
            <button
              className="review-delete-btn"
              onClick={handleDelete}
              disabled={deleting}
              title="Eliminar reseña (admin)"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
      <p className="review-text">{review.comentario}</p>
    </div>
  );
};

export default ReviewCard;