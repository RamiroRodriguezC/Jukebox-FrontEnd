import api from '../api/api';
import { message } from 'antd';

export const deleteUser = async (userId, { onSuccess, onError } = {}) => {
  try {
    console.log('deleteUser llamado con userId:', userId);  // ← esto es para verificar que el ID se recibe correctamente
    await api.delete(`/usuarios/${userId}`);
    message.success('Cuenta eliminada');
    onSuccess?.();
  } catch (err) {
    message.error(err.response?.data?.error || 'Error al eliminar');
    onError?.(err);
  }
};