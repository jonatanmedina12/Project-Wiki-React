// src/feature/Technical-Search/utils/textUtils.tsx
import React from 'react';

/**
 * Resalta el texto que coincide con el término de búsqueda
 * @param text - Texto a procesar
 * @param searchTerm - Término a resaltar
 * @returns ReactNode con el texto resaltado
 */
export const highlightText = (text: string, searchTerm: string): React.ReactNode => {
  if (!searchTerm.trim()) return text;
  
  try {
    // Escapar caracteres especiales para regex
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : (
        part
      )
    );
  } catch (error) {
    console.error('Error al resaltar texto:', error);
    return text;
  }
};

/**
 * Obtiene un icono apropiado basado en el título del subtema
 * @param titulo - Título del subtema
 * @returns Emoji correspondiente al tipo de contenido
 */
export const getIconoParaSubtema = (titulo: string): string => {
  const tituloLower = titulo.toLowerCase();
  
  const iconMap: Array<[string[], string]> = [
    [['config', 'setup', 'configuración'], '⚙️'],
    [['api', 'endpoint', 'rest'], '🔌'],
    [['database', 'db', 'datos'], '🗄️'],
    [['security', 'auth', 'seguridad'], '🔐'],
    [['test', 'testing', 'prueba'], '🧪'],
    [['deploy', 'deployment', 'despliegue'], '🚀'],
    [['monitor', 'monitoring', 'monitoreo'], '📊'],
    [['performance', 'rendimiento', 'optimización'], '⚡'],
    [['error', 'bug', 'debug'], '🐛'],
    [['docs', 'documentation', 'documentación'], '📚'],
    [['integration', 'integración'], '🔗'],
    [['migration', 'migración'], '📦'],
    [['backup', 'respaldo'], '💾'],
    [['cloud', 'nube'], '☁️'],
    [['mobile', 'móvil'], '📱'],
    [['email', 'correo'], '📧'],
    [['report', 'reporte', 'informe'], '📈'],
    [['user', 'usuario'], '👤'],
    [['team', 'equipo'], '👥'],
    [['workflow', 'flujo'], '🔄']
  ];
  
  for (const [keywords, icon] of iconMap) {
    if (keywords.some(keyword => tituloLower.includes(keyword))) {
      return icon;
    }
  }
  
  return '📋'; // Icono por defecto
};

/**
 * Trunca el texto a un número máximo de caracteres
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @returns Texto truncado con elipsis si es necesario
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Genera un slug a partir de un texto
 * @param text - Texto a convertir
 * @returns Slug generado
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9]+/g, '-')     // Reemplazar no alfanuméricos con guiones
    .replace(/^-+|-+$/g, '');        // Remover guiones al inicio y final
};