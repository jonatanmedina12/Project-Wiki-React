// src/data/index.ts
import { crmSystemsData } from './sections/crm-systems';
import { apiMethodsData } from './sections/api-methods';
import { httpMethodsData } from './sections/http-methods';

import type { Seccion } from '../types';

/**
 * Exporta todas las secciones disponibles
 * Cada sección debe seguir la estructura de tipo Seccion
 */
export const allSections: Seccion[] = [
  crmSystemsData,
  apiMethodsData,
  httpMethodsData

  // Descomentar cuando se creen estas secciones:
  // integrationData,
  // configurationData,
  // securityData,
  // analyticsData,
  // migrationData,
];

/**
 * Mapa de secciones por ID para acceso rápido
 */
export const sectionsMap = new Map<string, Seccion>(
  allSections.map(section => [section.id, section])
);

/**
 * Obtiene una sección por su ID
 * @param id - ID de la sección
 * @returns Sección encontrada o undefined
 */
export const getSectionById = (id: string): Seccion | undefined => {
  return sectionsMap.get(id);
};

/**
 * Obtiene todos los subtemas de todas las secciones
 * @returns Array plano de todos los subtemas
 */
export const getAllSubtemas = () => {
  return allSections.flatMap(section => 
    section.subtemas.map(subtema => ({
      ...subtema,
      seccionId: section.id,
      seccionTitulo: section.titulo
    }))
  );
};