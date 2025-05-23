// src/components/BuscadorTecnico/utils/searchUtils.ts
import type { Seccion, ResultadoBusqueda } from '../../types';

/**
 * Realiza búsqueda en las secciones y retorna resultados ordenados por relevancia
 * @param secciones - Array de secciones donde buscar
 * @param searchTerm - Término de búsqueda
 * @returns Array de resultados ordenados por relevancia
 */
export const performSearch = (
  secciones: Seccion[], 
  searchTerm: string
): ResultadoBusqueda[] => {
  if (!searchTerm.trim()) return [];
  
  const busquedaLower = searchTerm.toLowerCase();
  const resultados: ResultadoBusqueda[] = [];
  
  secciones.forEach((seccion) => {
    // Búsqueda en título de sección
    if (seccion.titulo.toLowerCase().includes(busquedaLower)) {
      resultados.push({
        id: seccion.id,
        texto: seccion.titulo,
        tipo: 'seccion',
        path: [seccion.titulo]
      });
    }
    
    // Búsqueda en descripción de sección
    if (seccion.descripcion?.toLowerCase().includes(busquedaLower)) {
      resultados.push({
        id: seccion.id,
        texto: `${seccion.titulo} - ${seccion.descripcion}`,
        tipo: 'seccion',
        path: [seccion.titulo]
      });
    }
    
    // Búsqueda en subtemas
    seccion.subtemas.forEach((subtema) => {
      const path = [seccion.titulo, subtema.titulo];
      
      // Título de subtema
      if (subtema.titulo.toLowerCase().includes(busquedaLower)) {
        resultados.push({
          id: seccion.id,
          texto: subtema.titulo,
          tipo: 'subtema',
          subtemaId: subtema.id,
          path
        });
      }
      
      // Contenido de items en subtemas
      subtema.items.forEach((item) => {
        // Búsqueda en subtítulo
        if (item.subtitulo.toLowerCase().includes(busquedaLower)) {
          resultados.push({
            id: seccion.id,
            texto: item.subtitulo,
            tipo: 'item',
            subtemaId: subtema.id,
            path: [...path, item.subtitulo]
          });
        }
        
        // Búsqueda en texto
        if (item.texto?.toLowerCase().includes(busquedaLower)) {
          resultados.push({
            id: seccion.id,
            texto: `${item.subtitulo} - ${truncateForSearch(item.texto)}`,
            tipo: 'texto',
            subtemaId: subtema.id,
            path: [...path, item.subtitulo]
          });
        }
        
        // Búsqueda en código
        if (item.codigo?.toLowerCase().includes(busquedaLower)) {
          resultados.push({
            id: seccion.id,
            texto: `Código en ${item.subtitulo}`,
            tipo: 'codigo',
            subtemaId: subtema.id,
            path: [...path, item.subtitulo]
          });
        }
        
        // Búsqueda en items de lista
        item.items?.forEach((subitem) => {
          if (subitem.toLowerCase().includes(busquedaLower)) {
            resultados.push({
              id: seccion.id,
              texto: `${item.subtitulo} - ${truncateForSearch(subitem)}`,
              tipo: 'item',
              subtemaId: subtema.id,
              path: [...path, item.subtitulo]
            });
          }
        });
      });
    });
  });
  
  // Ordenar por relevancia
  return sortByRelevance(resultados, searchTerm);
};

/**
 * Ordena los resultados por relevancia
 * @param resultados - Array de resultados
 * @param searchTerm - Término de búsqueda
 * @returns Array ordenado por relevancia
 */
const sortByRelevance = (
  resultados: ResultadoBusqueda[], 
  searchTerm: string
): ResultadoBusqueda[] => {
  const termLower = searchTerm.toLowerCase();
  
  return resultados.sort((a, b) => {
    // Prioridad por tipo
    const typePriority: Record<ResultadoBusqueda['tipo'], number> = {
      seccion: 5,
      subtema: 4,
      item: 3,
      texto: 2,
      codigo: 1
    };
    
    // Coincidencia exacta tiene mayor prioridad
    const aExact = a.texto.toLowerCase() === termLower;
    const bExact = b.texto.toLowerCase() === termLower;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    
    // Coincidencia al inicio tiene segunda prioridad
    const aStarts = a.texto.toLowerCase().startsWith(termLower);
    const bStarts = b.texto.toLowerCase().startsWith(termLower);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    
    // Por tipo de resultado
    const aPriority = typePriority[a.tipo] || 0;
    const bPriority = typePriority[b.tipo] || 0;
    if (aPriority !== bPriority) return bPriority - aPriority;
    
    // Por longitud del texto (más corto = más relevante)
    return a.texto.length - b.texto.length;
  });
};

/**
 * Trunca texto para mostrar en resultados de búsqueda
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima (default: 100)
 * @returns Texto truncado
 */
const truncateForSearch = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  
  // Intentar cortar en el último espacio antes del límite
  const lastSpaceIndex = text.lastIndexOf(' ', maxLength);
  const cutIndex = lastSpaceIndex > 0 ? lastSpaceIndex : maxLength;
  
  return text.substring(0, cutIndex) + '...';
};

/**
 * Resalta múltiples términos de búsqueda en un texto
 * @param text - Texto donde resaltar
 * @param terms - Array de términos a resaltar
 * @returns Texto con términos resaltados
 */
export const highlightMultipleTerms = (text: string, terms: string[]): string => {
  let result = text;
  
  terms.forEach((term) => {
    if (term.trim()) {
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedTerm})`, 'gi');
      result = result.replace(regex, '<mark class="search-highlight">$1</mark>');
    }
  });
  
  return result;
};