// src/types/index.ts

/**
 * Interfaz para items individuales de contenido
 * Representa un bloque de información con posible código, imagen y lista de items
 */
export interface Item {
    subtitulo: string;
    texto?: string;
    items?: string[];
    codigo?: string;
    lenguaje?: string; // Añadido para resolver el error
    imagen?: string;
    descripcionImagen?: string;
  }
  
  /**
   * Interfaz para subtemas dentro de una sección
   * Agrupa items relacionados bajo un tema específico
   */
  export interface Subtema {
    id: string;
    titulo: string;
    icono?: string;
    items: Item[];
  }
  
  /**
   * Interfaz para secciones principales
   * Contiene subtemas organizados jerárquicamente
   */
  export interface Seccion {
    id: string;
    titulo: string;
    descripcion?: string;
    icono?: string;
    subtemas: Subtema[];
  }
  
  /**
   * Interfaz legacy para compatibilidad con datos existentes
   * @deprecated Usar Seccion con subtemas en su lugar
   */
  export interface SeccionLegacy {
    id: string;
    titulo: string;
    contenido: Item[];
  }
  
  /**
   * Interfaz para resultados de búsqueda
   * Incluye información adicional para navegación
   */
  export interface ResultadoBusqueda {
    id: string;
    texto: string;
    tipo: 'seccion' | 'subtema' | 'item' | 'texto' | 'codigo';
    subtemaId?: string;
    highlightText?: string;
    path?: string[]; // Ruta de navegación
  }
  
  /**
   * Configuración para la transformación de datos legacy
   */
  export interface TransformConfig {
    itemsPorSubtema?: number;
    generarIconos?: boolean;
    preservarEstructura?: boolean;
  }