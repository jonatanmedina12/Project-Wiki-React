// src/components/BuscadorTecnico/BuscadorTecnico.tsx
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BuscadorTecnico.css';
import { allSections } from '../../feature/data';
import type { Seccion, SeccionLegacy } from '../../feature/types';

// Componentes
import Sidebar from '../../feature/Technical-Search/components/Sidebar';
import MainContent from '../../feature/Technical-Search/components/MainContent';

// Utilidades
import { performSearch } from '../../feature/Technical-Search/utils/searchUtils';
import { transformarDatosASubtemas } from '../../feature/Technical-Search/utils/dataTransformer';

// Hooks personalizados
import { useKeyboardShortcuts } from '../../feature/Technical-Search/hooks/useKeyboardShortcuts';
import { useLocalStorage } from '../../feature/Technical-Search/hooks/useLocalStorage';

/**
 * Constantes para valores por defecto
 * Aplicando el principio DRY (Don't Repeat Yourself)
 */
const DEFAULT_SECTION = 'crm-systems';
const LOCAL_STORAGE_KEYS = {
  ACTIVE_SECTION: 'buscador-seccion-activa',
  ACTIVE_SUBTOPIC: 'buscador-subtema-activo'
} as const;


/**
 * Hook personalizado para manejar la sincronización de navegación
 * Principio de Inversión de Dependencias - separando la lógica de navegación
 */
const useNavigationSync = (
  sectionId: string | undefined,
  seccionActiva: string,
  setSeccionActiva: (value: string) => void,
  navigate: ReturnType<typeof useNavigate>
) => {
  const navigationRef = useRef({
    isNavigating: false,
    lastSectionId: ''
  });

  useEffect(() => {
    // Evitar bucles de navegación
    if (navigationRef.current.isNavigating) {
      return;
    }

    const urlSectionId = sectionId || DEFAULT_SECTION;
    
    // Solo actualizar si hay un cambio real y no estamos navegando
    if (urlSectionId !== seccionActiva && 
        urlSectionId !== navigationRef.current.lastSectionId) {
      
      navigationRef.current.isNavigating = true;
      navigationRef.current.lastSectionId = urlSectionId;
      
      setSeccionActiva(urlSectionId);
      
      // Actualizar URL si es diferente
      if (sectionId !== urlSectionId) {
        navigate(`/guide/${urlSectionId}`, { replace: true });
      }
      
      // Liberar el flag después de la actualización
      setTimeout(() => {
        navigationRef.current.isNavigating = false;
      }, 100);
    }
  }, [sectionId, seccionActiva, setSeccionActiva, navigate]);

  return navigationRef.current.isNavigating;
};

/**
 * Hook para manejar la expansión automática de secciones
 * Principio de Responsabilidad Única
 */
const useAutoExpansion = (
  seccionActiva: string,
  seccionesExpandidas: Set<string>,
  setSeccionesExpandidas: React.Dispatch<React.SetStateAction<Set<string>>>
) => {
  useEffect(() => {
    if (seccionActiva && !seccionesExpandidas.has(seccionActiva)) {
      setSeccionesExpandidas(prev => new Set([...prev, seccionActiva]));
    }
  }, [seccionActiva, seccionesExpandidas, setSeccionesExpandidas]);
};

/**
 * Hook para manejar la selección automática de subtemas
 * Separación de responsabilidades
 */
const useSubtopicAutoSelection = (
  seccionActiva: string,
  secciones: Seccion[],
  subtemaActivo: string,
  setSubtemaActivo: (value: string) => void,
  isNavigating: boolean
) => {
  useEffect(() => {
    // No proceder si estamos navegando o no hay sección activa
    if (isNavigating || !seccionActiva) {
      return;
    }

    const seccionActual = secciones.find(s => s.id === seccionActiva);
    
    if (seccionActual && seccionActual.subtemas.length > 0) {
      // Solo establecer subtema si no hay uno activo o el actual no pertenece a esta sección
      const subtemaExisteEnSeccion = seccionActual.subtemas.some(
        subtema => subtema.id === subtemaActivo
      );
      
      if (!subtemaActivo || !subtemaExisteEnSeccion) {
        setSubtemaActivo(seccionActual.subtemas[0].id);
      }
    }
  }, [seccionActiva, secciones, subtemaActivo, setSubtemaActivo, isNavigating]);
};

/**
 * Componente principal del buscador técnico
 * Implementa principios SOLID:
 * - S: Responsabilidad única - coordina componentes
 * - O: Abierto/Cerrado - extensible mediante hooks
 * - L: Sustitución de Liskov - hooks son intercambiables
 * - I: Segregación de interfaces - interfaces específicas
 * - D: Inversión de dependencias - usa abstracciones (hooks)
 */
const BuscadorTecnico: React.FC = () => {
  // Parámetros de navegación
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();

  // Estado principal usando patrón de estado inmutable
  const [busqueda, setBusqueda] = useState<string>('');
  const [seccionActiva, setSeccionActiva] = useLocalStorage<string>(
    LOCAL_STORAGE_KEYS.ACTIVE_SECTION,
    sectionId || DEFAULT_SECTION
  );
  const [subtemaActivo, setSubtemaActivo] = useLocalStorage<string>(
    LOCAL_STORAGE_KEYS.ACTIVE_SUBTOPIC,
    ''
  );

  // Estado de UI
  const [seccionesExpandidas, setSeccionesExpandidas] = useState<Set<string>>(
    new Set([seccionActiva])
  );
  const [subtemasExpandidos, setSubtemasExpandidos] = useState<Set<string>>(new Set());

  // Transformación de datos usando memoización para optimización
  const secciones = useMemo(() => {
    // Verificar formato de datos (Principio de Abierto/Cerrado)
    if (allSections.length > 0 && 'subtemas' in allSections[0]) {
      return allSections as Seccion[];
    }
    
    // Transformar datos legacy con configuración por defecto
    return transformarDatosASubtemas(allSections as unknown as SeccionLegacy[], {
      itemsPorSubtema: 3,
      generarIconos: true,
      preservarEstructura: true
    });
  }, []);

  // Hooks especializados (Inversión de Dependencias)
  const isNavigating = useNavigationSync(sectionId, seccionActiva, setSeccionActiva, navigate);
  
  useAutoExpansion(seccionActiva, seccionesExpandidas, setSeccionesExpandidas);
  
  useSubtopicAutoSelection(
    seccionActiva, 
    secciones, 
    subtemaActivo, 
    setSubtemaActivo,
    isNavigating
  );

  // Memoización de resultados de búsqueda para optimización
  const resultados = useMemo(() => 
    performSearch(secciones, busqueda), 
    [secciones, busqueda]
  );

  // Funciones de toggle usando useCallback para evitar re-renders innecesarios
  const toggleSeccion = useCallback((seccionId: string) => {
    setSeccionesExpandidas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(seccionId)) {
        newSet.delete(seccionId);
      } else {
        newSet.add(seccionId);
      }
      return newSet;
    });
  }, []);

  const toggleSubtema = useCallback((subtemaId: string) => {
    setSubtemasExpandidos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subtemaId)) {
        newSet.delete(subtemaId);
      } else {
        newSet.add(subtemaId);
      }
      return newSet;
    });
  }, []);

  // Handlers para atajos de teclado (Principio de Responsabilidad Única)
  const handleSearchFocus = useCallback(() => {
    const searchInput = document.querySelector('.input-busqueda') as HTMLInputElement;
    searchInput?.focus();
  }, []);

  const handleSearchClear = useCallback(() => {
    setBusqueda('');
    const searchInput = document.querySelector('.input-busqueda') as HTMLInputElement;
    searchInput?.blur();
  }, []);

  // Configuración de atajos de teclado
  useKeyboardShortcuts({
    onSearch: handleSearchFocus,
    onEscape: handleSearchClear
  });

  return (
    <div className="buscador-container">
      <Sidebar 
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        resultados={resultados}
        secciones={secciones}
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
        subtemaActivo={subtemaActivo}
        setSubtemaActivo={setSubtemaActivo}
        seccionesExpandidas={seccionesExpandidas}
        toggleSeccion={toggleSeccion}
        setSeccionesExpandidas={setSeccionesExpandidas}
      />
      
      <MainContent 
        secciones={secciones}
        seccionActiva={seccionActiva}
        subtemaActivo={subtemaActivo}
        searchTerm={busqueda}
        subtemasExpandidos={subtemasExpandidos}
        toggleSubtema={toggleSubtema}
      />
    </div>
  );
};

export default BuscadorTecnico;