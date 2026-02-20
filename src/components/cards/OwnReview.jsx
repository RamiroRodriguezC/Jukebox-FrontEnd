import { useState } from 'react';
import { Star } from 'lucide-react';
import { message } from 'antd';
import ReviewCard from './ReviewCard';
import api from '../../api/api';
import './ReviewCard.css';
import './OwnReview.css';

const ReviewModal = ({ open, onClose, onSubmit, saving, existing }) => {
  const [form, setForm] = useState({
    rating:     existing?.rating     ?? 0,
    comentario: existing?.comentario ?? '',
    like:       existing?.like       ?? false,
  });

  if (!open) return null;

  return (
    <div className="rmodal-overlay" onClick={onClose}>
      <div className="rmodal-card" onClick={e => e.stopPropagation()}>

        <div className="rmodal-header">
          <h3>{existing ? 'Editar reseña' : 'Escribir reseña'}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="rmodal-field">
          <label>Puntuación</label>
          <div className="rmodal-stars">
            {[1,2,3,4,5].map(n => (
              <Star key={n} size={26} style={{ cursor: 'pointer' }}
                className={n <= form.rating ? 'star-filled' : 'star-empty'}
                onClick={() => setForm(f => ({ ...f, rating: n }))} />
            ))}
          </div>
        </div>

        <div className="rmodal-field">
          <label>
            <input type="checkbox" checked={form.like}
              onChange={e => setForm(f => ({ ...f, like: e.target.checked }))} />
            {' '}Me gustó
          </label>
        </div>

        <div className="rmodal-field">
          <label>Comentario (opcional)</label>
          <textarea className="rmodal-textarea" rows={4} value={form.comentario}
            placeholder="Contá qué te pareció..."
            onChange={e => setForm(f => ({ ...f, comentario: e.target.value }))} />
        </div>

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

/* ── OwnReview: muestra botón escribir, o la review propia con editar/eliminar ── */
const OwnReview = ({ userId, entityId, entityType, ownReview, onReviewChange }) => {
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  const closeModal = () => { setModal(false); setEditing(null); };

  const handleCreate = async (form) => {
    setSaving(true);
    try {
      const { data } = await api.post('/reviews/create', {
        rating: form.rating, comentario: form.comentario, like: form.like,
        entidad_tipo: entityType, entidad_id: entityId, autor_id: userId,
      });
      onReviewChange('create', data);
      closeModal();
      message.success('¡Reseña publicada!');
    } catch (err) {
      message.error(err.response?.data?.error || 'Error al publicar');
    } finally { setSaving(false); }
  };

  const handleEdit = async (form) => {
    setSaving(true);
    try {
      const { data } = await api.put(`/reviews/${ownReview._id}`, {
        rating: form.rating, comentario: form.comentario, like: form.like,
      });
      onReviewChange('edit', data);
      closeModal();
      message.success('Reseña actualizada');
    } catch (err) {
      message.error(err.response?.data?.error || 'Error al actualizar');
    } finally { setSaving(false); }
  };

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

  if (!ownReview) return (
    <>
      <button className="btn-write-review" onClick={() => setModal(true)}>
        ✏️ Escribir reseña
      </button>
      <ReviewModal open={modal} onClose={closeModal} onSubmit={handleCreate} saving={saving} existing={null} />
    </>
  );

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