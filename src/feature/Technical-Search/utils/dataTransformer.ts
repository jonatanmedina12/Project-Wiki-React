// src/components/BuscadorTecnico/utils/dataTransformer.ts
import type { Seccion, SeccionLegacy, Subtema, Item } from '../../types';
import { getIconoParaSubtema, generateSlug } from './textUtils';

interface TransformConfig {
  itemsPorSubtema?: number;
  generarIconos?: boolean;
  preservarEstructura?: boolean;
}

/**
 * Transforma datos en formato legacy a la nueva estructura con subtemas
 * @param seccionesLegacy - Array de secciones en formato antiguo
 * @param config - Configuración para la transformación
 * @returns Array de secciones con subtemas
 */
export const transformarDatosASubtemas = (
  seccionesLegacy: SeccionLegacy[], 
  config: TransformConfig = {}
): Seccion[] => {
  const {
    itemsPorSubtema = 3,
    generarIconos = true,
    preservarEstructura = false
  } = config;

  return seccionesLegacy.map(seccion => {
    const seccionTransformada = transformarSeccion(seccion, {
      itemsPorSubtema,
      generarIconos,
      preservarEstructura
    });
    
    // Asegurarse de que la descripción no sea undefined
    if (!seccionTransformada.descripcion) {
      seccionTransformada.descripcion = '';
    }
    
    return seccionTransformada;
  });
};

/**
 * Transforma una sección individual
 * @param seccionLegacy - Sección en formato legacy
 * @param config - Configuración
 * @returns Sección transformada
 */
const transformarSeccion = (
  seccion: SeccionLegacy, 
  config: TransformConfig
): Seccion => {
  const subtemas = preservarEstructura(config) 
    ? crearSubtemasPreservandoEstructura(seccion, config)
    : crearSubtemasAutomaticos(seccion, config);

  return {
    id: seccion.id,
    titulo: seccion.titulo,
    descripcion: generarDescripcionSeccion(seccion),
    icono: obtenerIconoSeccion(seccion.id),
    subtemas
  };
};

/**
 * Crea subtemas preservando la estructura original
 * Agrupa items por similitud de títulos
 */
const crearSubtemasPreservandoEstructura = (
  seccion: SeccionLegacy,
  config: TransformConfig
): Subtema[] => {
  const grupos = new Map<string, typeof seccion.contenido>();
  
  // Agrupar por categorías basadas en los títulos
  seccion.contenido.forEach((item: Item) => {
    const categoria = item.subtitulo ? detectarCategoria(item.subtitulo) : 'General';
    if (!grupos.has(categoria)) {
      grupos.set(categoria, []);
    }
    grupos.get(categoria)!.push(item);
  });
  
  // Convertir grupos a subtemas
  return Array.from(grupos.entries()).map(([categoria, items]) => ({
    id: `${seccion.id}-${generateSlug(categoria)}`,
    titulo: categoria,
    icono: config.generarIconos ? getIconoParaSubtema(categoria) : undefined,
    items
  }));
};

/**
 * Crea subtemas automáticamente dividiendo por cantidad
 */
const crearSubtemasAutomaticos = (
  seccion: SeccionLegacy,
  config: TransformConfig
): Subtema[] => {
  const subtemas: Subtema[] = [];
  const itemsPorSubtema = config.itemsPorSubtema || 3;
  
  for (let i = 0; i < seccion.contenido.length; i += itemsPorSubtema) {
    const items = seccion.contenido.slice(i, i + itemsPorSubtema);
    const subtemaIndex = Math.floor(i / itemsPorSubtema) + 1;
    
    // Generar un título para el subtema
    const titulo = items[0]?.subtitulo 
      ? `${items[0].subtitulo.split('-')[0].trim() || 'Subtema'} ${subtemaIndex}`
      : `Subtema ${subtemaIndex}`;
    const subtemaId = `${seccion.id}-subtema-${subtemaIndex}`;
    
    subtemas.push({
      id: subtemaId,
      titulo,
      icono: config.generarIconos ? getIconoParaSubtema(titulo) : undefined,
      items
    });
  }
  
  return subtemas;
};

/**
 * Detecta la categoría de un item basándose en su título
 */
const detectarCategoria = (titulo: string): string => {
  const tituloLower = titulo.toLowerCase();
  
  const categorias: Array<[string[], string]> = [
    [['salesforce', 'dynamics', 'hubspot', 'pipedrive'], 'Plataformas CRM'],
    [['enterprise', 'empresarial'], 'CRM Empresariales'],
    [['pyme', 'startup', 'small'], 'CRM para PYMEs'],
    [['integration', 'integración', 'api'], 'Integraciones'],
    [['config', 'setup', 'instalación'], 'Configuración'],
    [['pricing', 'precio', 'costo'], 'Precios y Planes'],
    [['feature', 'característica', 'funcionalidad'], 'Características'],
    [['security', 'seguridad', 'auth'], 'Seguridad'],
    [['report', 'analytics', 'análisis'], 'Reportes y Análisis'],
    [['migration', 'migración'], 'Migración de Datos']
  ];
  
  for (const [keywords, categoria] of categorias) {
    if (keywords.some(keyword => tituloLower.includes(keyword))) {
      return categoria;
    }
  }
  
  // Si no se detecta categoría, usar las primeras palabras del título
  return titulo.split('-')[0].trim() || 'General';
};


/**
 * Genera una descripción para la sección
 */
const generarDescripcionSeccion = (seccion: SeccionLegacy): string => {
  const totalItems = seccion.contenido.length;
  const tiposContenido = new Set<string>();
  
  seccion.contenido.forEach((item: Item) => {
    if ('codigo' in item && item.codigo) tiposContenido.add('código');
    if ('imagen' in item && item.imagen) tiposContenido.add('imágenes');
    if ('items' in item && item.items && item.items.length > 0) tiposContenido.add('listas');
  });
  
  const tipos = Array.from(tiposContenido).join(', ');
  return `${totalItems} elementos${tipos ? ` con ${tipos}` : ''}`;
};

/**
 * Obtiene el icono para una sección basándose en su ID
 */
const obtenerIconoSeccion = (seccionId: string): string => {
  const iconosSeccion: Record<string, string> = {
    'crm-systems': '🏢',
    'integration': '🔗',
    'configuration': '⚙️',
    'security': '🔐',
    'migration': '📦',
    'analytics': '📊',
    'automation': '🤖',
    'mobile': '📱',
    'support': '🎧',
    'training': '🎓'
  };
  
  return iconosSeccion[seccionId] || '📁';
};

/**
 * Valida si debe preservarse la estructura original
 */
const preservarEstructura = (config: TransformConfig): boolean => {
  return config.preservarEstructura === true;
};