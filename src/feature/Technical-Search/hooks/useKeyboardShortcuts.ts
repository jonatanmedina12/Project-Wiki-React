// src/components/BuscadorTecnico/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';

interface KeyboardShortcutsOptions {
  onSearch?: () => void;
  onEscape?: () => void;
  onNavigateNext?: () => void;
  onNavigatePrev?: () => void;
}

/**
 * Hook personalizado para manejar atajos de teclado
 * @param options - Callbacks para diferentes combinaciones de teclas
 */
export const useKeyboardShortcuts = (options: KeyboardShortcutsOptions) => {
  const {
    onSearch,
    onEscape,
    onNavigateNext,
    onNavigatePrev
  } = options;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K para búsqueda
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onSearch?.();
      }
      
      // Escape para limpiar búsqueda
      if (e.key === 'Escape') {
        onEscape?.();
      }
      
      // Alt + Flecha abajo para siguiente
      if (e.altKey && e.key === 'ArrowDown') {
        e.preventDefault();
        onNavigateNext?.();
      }
      
      // Alt + Flecha arriba para anterior
      if (e.altKey && e.key === 'ArrowUp') {
        e.preventDefault();
        onNavigatePrev?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSearch, onEscape, onNavigateNext, onNavigatePrev]);
};