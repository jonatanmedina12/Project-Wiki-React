// src/components/BuscadorTecnico/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

/**
 * Hook personalizado para sincronizar estado con localStorage
 * @param key - Clave para localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 * @returns Tuple con el valor y setter
 */
export const useLocalStorage = <T>(
  key: string, 
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Obtener del localStorage
      const item = window.localStorage.getItem(key);
      // Parsear JSON almacenado o usar valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error al leer localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Función actualizada para setValue
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que el valor sea una función
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Guardar estado
      setStoredValue(valueToStore);
      
      // Guardar en localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error al guardar en localStorage key "${key}":`, error);
    }
  };

  // Sincronizar entre pestañas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error al sincronizar localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
};