import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import './ReviewModal.css';

const ReviewModal = ({ isOpen, onClose, onSubmit, saving, existingReview = null }) => {
  const [form, setForm] = useState({ rating: 0, comentario: '', like: false });

  // Si viene una review existente (edición), pre-cargamos el form
  useEffect(() => {
    if (existingReview) {
      setForm({
        rating:     existingReview.rating     ?? 0,
        comentario: existingReview.comentario ?? '',
        like:       existingReview.like       ?? false,
      });
    } else {
      setForm({ rating: 0, comentario: '', like: false });
    }
  }, [existingReview, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.rating) return;
    onSubmit(form);
  };

  const isEditing = !!existingReview;

  return (
    <div className="rmodal-overlay" onClick={onClose}>
      <div className="rmodal-card" onClick={e => e.stopPropagation()}>

        <div className="rmodal-header">
          <h3>{isEditing ? 'Editar reseña' : 'Escribir reseña'}</h3>
          <button className="rmodal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="rmodal-form">

          {/* Rating */}
          <div className="rmodal-field">
            <label>Puntuación</label>
            <div className="rmodal-stars">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  className="rmodal-star-btn"
                  onClick={() => setForm(f => ({ ...f, rating: n }))}
                >
                  <Star
                    size={28}
                    className={n <= form.rating ? 'star-filled' : 'star-empty'}
                  />
                </button>
              ))}
            </div>
            {!form.rating && <span className="rmodal-hint">Seleccioná una puntuación</span>}
          </div>

          {/* Like */}
          <div className="rmodal-field">
            <label>¿Te gustó?</label>
            <div className="rmodal-like-row">
              <button
                type="button"
                className={`rmodal-like-btn ${form.like ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, like: !f.like }))}
              >
                {form.like ? '👍 Me gusta' : '👍 Marcar como me gusta'}
              </button>
            </div>
          </div>

          {/* Comentario */}
          <div className="rmodal-field">
            <label>Comentario <span className="rmodal-optional">(opcional)</span></label>
            <textarea
              className="rmodal-textarea"
              placeholder="Contá qué te pareció..."
              rows={4}
              value={form.comentario}
              onChange={e => setForm(f => ({ ...f, comentario: e.target.value }))}
            />
          </div>

          <div className="rmodal-actions">
            <button type="button" className="rmodal-btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="rmodal-btn-submit"
              disabled={saving || !form.rating}
            >
              {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Publicar reseña'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReviewModal;