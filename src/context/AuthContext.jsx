// El context es una forma de compartir datos entre componentes sin tener que pasar props manualmente en cada nivel.
import { createContext, useState, useEffect, useContext } from 'react';

// Creamos el "Contexto". 
// Los componentes que quieran "oír" los datos del usuario se "sintonizarán" aquí.
export const AuthContext = createContext();

// El provider es el canal que provee los datos (context) a los componentes hijos.
// children es todo lo que esté dentro del AuthProvider en el árbol de componentes.
export const AuthProvider = ({ children }) => {
  // Estado para guardar el objeto del usuario (nombre, mail, rol, etc.)
  const [user, setUser] = useState(null);
  // Estado para saber si la app está verificando si ya había una sesión iniciada.
  // Evita que la app se muestre "vacía" un segundo antes de cargar al usuario.
  const [loading, setLoading] = useState(true);

  // useEffect se ejecuta una sola vez cuando se abre la app.
  useEffect(() => {
    // Local Storage es un objeto que guarda datos en el navegador, incluso si se cierra.
    // Revisamos si en el almacenamiento del navegador (localStorage) quedó algo guardado.
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      // Si existe, lo transformamos de texto a objeto JS y lo ponemos en el estado.
      setUser(JSON.parse(savedUser));
    }
    
    // Ya terminamos de revisar, dejamos de cargar.
    setLoading(false);
  }, []);

  // Función de Login: Se llama cuando el backend nos dice que los datos son correctos.
  const login = (userData, token) => {
    // Guardamos el token (para la API) y los datos (para la UI) en el navegador.
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Actualizamos el estado de React para que el Navbar cambie al instante.
    setUser(userData);
  };

  // Función de Logout: Limpia todo para cerrar la sesión.
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Al volver a null, React esconderá automáticamente las partes privadas de Jukebox.
    setUser(null);
  };

  // El Provider devuelve el canal con los datos y funciones que queremos compartir.
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Si no está cargando, mostramos los hijos (la app)  */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
// Este hook es una forma fácil de "sintonizar" los componentes con el contexto de autenticación.
// En vez de importar useContext y AuthContext en cada componente, solo importan este hook.
export const useAuth = () => useContext(AuthContext);