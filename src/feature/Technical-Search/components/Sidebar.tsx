// src/feature/Technical-Search/components/Sidebar.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { Layout, Input, Button, Typography, List, Collapse, Space, theme } from 'antd';
import { SearchOutlined, CloseOutlined, BulbOutlined, FolderOutlined, FileOutlined } from '@ant-design/icons';
import type { Seccion, ResultadoBusqueda } from '../../types';
import SearchResult from './SearchResult';

const { Sider } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;

// Constantes para configuración
const SIDEBAR_CONFIG = {
  WIDTH: 300,
  MAX_RESULTS: 20,
  SCROLL_DELAY: 100
} as const;

interface SidebarProps {
  busqueda: string;
  setBusqueda: React.Dispatch<React.SetStateAction<string>>;
  resultados: ResultadoBusqueda[];
  secciones: Seccion[];
  seccionActiva: string;
  setSeccionActiva: React.Dispatch<React.SetStateAction<string>>;
  subtemaActivo: string;
  setSubtemaActivo: React.Dispatch<React.SetStateAction<string>>;
  seccionesExpandidas: Set<string>;
  setSeccionesExpandidas: React.Dispatch<React.SetStateAction<Set<string>>>;
  toggleSeccion: (seccionId: string) => void;
}

/**
 * Hook personalizado para manejar la navegación de resultados
 * Principio de Responsabilidad Única
 */
const useResultNavigation = (
  setSeccionActiva: React.Dispatch<React.SetStateAction<string>>,
  setSubtemaActivo: React.Dispatch<React.SetStateAction<string>>,
  setSeccionesExpandidas: React.Dispatch<React.SetStateAction<Set<string>>>,
  seccionesExpandidas: Set<string>
) => {
  return useCallback((resultado: ResultadoBusqueda) => {
    // Actualizar sección activa
    setSeccionActiva(resultado.id);
    
    // Actualizar subtema si existe
    if (resultado.subtemaId) {
      setSubtemaActivo(resultado.subtemaId);
    }
    
    // Expandir sección si no está expandida
    if (!seccionesExpandidas.has(resultado.id)) {
      setSeccionesExpandidas(prev => new Set([...prev, resultado.id]));
    }
    
    // Scroll suave con debounce
    setTimeout(() => {
      const element = document.querySelector(
        `[data-subsection="${resultado.texto}"]`
      );
      element?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, SIDEBAR_CONFIG.SCROLL_DELAY);
  }, [setSeccionActiva, setSubtemaActivo, setSeccionesExpandidas, seccionesExpandidas]);
};

/**
 * Hook para manejar la navegación por subtemas
 * Evita bucles al usar useCallback con dependencias correctas
 */
const useSubtopicNavigation = (
  setSeccionActiva: React.Dispatch<React.SetStateAction<string>>,
  setSubtemaActivo: React.Dispatch<React.SetStateAction<string>>
) => {
  return useCallback((seccionId: string, subtemaId: string) => {
    // Actualización atómica para evitar estados inconsistentes
    setSeccionActiva(seccionId);
    setSubtemaActivo(subtemaId);
  }, [setSeccionActiva, setSubtemaActivo]);
};

/**
 * Componente de barra lateral con búsqueda y navegación
 * Implementa principios SOLID y Clean Code:
 * - Funciones puras donde sea posible
 * - Separación de responsabilidades mediante hooks
 * - Memoización para optimización de rendimiento
 * - Naming conventions claros y descriptivos
 */
export const Sidebar: React.FC<SidebarProps> = ({ 
  busqueda, 
  setBusqueda, 
  resultados, 
  secciones, 
  seccionActiva, 
  setSeccionActiva,
  subtemaActivo,
  setSubtemaActivo,
  seccionesExpandidas,
  setSeccionesExpandidas}) => {
  // Estado local para UI
  const [searchFocused, setSearchFocused] = useState(false);
  const { token } = theme.useToken();

  // Hooks personalizados
  const handleResultClick = useResultNavigation(
    setSeccionActiva,
    setSubtemaActivo,
    setSeccionesExpandidas,
    seccionesExpandidas
  );

  const handleSubtopicClick = useSubtopicNavigation(
    setSeccionActiva,
    setSubtemaActivo
  );

  // Handler para limpiar búsqueda - memoizado para evitar re-renders
  const handleClearSearch = useCallback(() => {
    setBusqueda('');
    const searchInput = document.querySelector('.input-busqueda') as HTMLInputElement;
    searchInput?.focus();
  }, [setBusqueda]);

  // Handler para cambios en el collapse - optimizado
  const handleCollapseChange = useCallback((keys: string | string[]) => {
    const keysArray = Array.isArray(keys) ? keys : [keys].filter(Boolean);
    setSeccionesExpandidas(new Set(keysArray));
  }, [setSeccionesExpandidas]);

  // Cálculos memoizados para estadísticas
  const estadisticas = useMemo(() => ({
    totalSecciones: secciones.length,
    totalSubtemas: secciones.reduce((acc, s) => acc + s.subtemas.length, 0)
  }), [secciones]);

  // Estilos memoizados para optimización
  const estilos = useMemo(() => ({
    sider: {
      background: token.colorBgContainer,
      borderRight: `1px solid ${token.colorBorderBg}`,
      height: '100vh',
      position: 'sticky' as const,
      top: 0,
      left: 0,
      overflow: 'auto' as const,
      padding: `${token.padding}px 0`,
    },
    header: {
      padding: `0 ${token.padding}px`,
      marginBottom: token.margin,
    },
    search: {
      marginBottom: token.margin,
      padding: `0 ${token.padding}px`,
    },
    content: {
      padding: `0 ${token.padding}px`,
      overflow: 'auto' as const,
      height: 'calc(100vh - 200px)',
    },
    footer: {
      padding: `${token.paddingSM}px ${token.padding}px`,
      borderTop: `1px solid ${token.colorBorderBg}`,
      fontSize: token.fontSizeSM,
      color: token.colorTextSecondary,
    },
    searchInput: {
      borderRadius: 8,
      borderColor: searchFocused ? token.colorPrimary : undefined,
    }
  }), [token, searchFocused]);

  // Render de resultados de búsqueda memoizado
  const renderSearchResults = useMemo(() => {
    if (busqueda.trim() === '') return null;

    return (
      <div>
        <Text type="secondary" style={{ display: 'block', marginBottom: token.margin }}>
          Resultados ({resultados.length})
        </Text>
        {resultados.length > 0 ? (
          <List
            size="small"
            dataSource={resultados.slice(0, SIDEBAR_CONFIG.MAX_RESULTS)}
            renderItem={(resultado) => (
              <List.Item 
                style={{ 
                  padding: '4px 8px',
                  borderRadius: token.borderRadius,
                  cursor: 'pointer',
                }}
                onClick={() => handleResultClick(resultado)}
              >
                <SearchResult 
                  resultado={resultado}
                  searchTerm={busqueda}
                  onClick={() => handleResultClick(resultado)}
                />
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: token.padding }}>
            <Text type="secondary">
              No se encontraron resultados para "{busqueda}"
            </Text>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Intenta con otros términos de búsqueda
              </Text>
            </div>
          </div>
        )}
      </div>
    );
  }, [busqueda, resultados, token, handleResultClick]);

  // Render de navegación por secciones memoizado
  const renderSectionNavigation = useMemo(() => {
    if (busqueda.trim() !== '') return null;

    return (
      <Collapse
        bordered={false}
        expandIconPosition="end"
        activeKey={Array.from(seccionesExpandidas)}
        onChange={handleCollapseChange}
        style={{ background: 'transparent' }}
        accordion={false}
        expandIcon={({ isActive }) => isActive ? <span>-</span> : <span>+</span>}
      >
        {secciones.map((seccion) => (
          <Panel
            key={seccion.id}
            header={
              <Space>
                <FolderOutlined style={{ color: token.colorPrimary }} />
                <Text>{seccion.titulo}</Text>
              </Space>
            }
            style={{
              border: 'none',
              background: seccionActiva === seccion.id ? token.colorFillAlter : 'transparent',
              borderRadius: token.borderRadius,
              marginBottom: 4,
            }}
          >
            <List
              size="small"
              dataSource={seccion.subtemas}
              renderItem={(subtema) => (
                <List.Item
                  style={{
                    padding: '4px 8px',
                    marginLeft: -8,
                    borderRadius: token.borderRadius,
                    cursor: 'pointer',
                    background: subtemaActivo === subtema.id ? token.colorPrimaryBg : 'transparent',
                  }}
                  onClick={() => handleSubtopicClick(seccion.id, subtema.id)}
                >
                  <Space>
                    <FileOutlined style={{ color: token.colorPrimary }} />
                    <Text>{subtema.titulo}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Panel>
        ))}
      </Collapse>
    );
  }, [
    busqueda, 
    secciones, 
    seccionesExpandidas, 
    seccionActiva, 
    subtemaActivo, 
    token, 
    handleCollapseChange, 
    handleSubtopicClick
  ]);

  return (
    <Sider 
      width={SIDEBAR_CONFIG.WIDTH} 
      style={estilos.sider}
      className="site-layout-background"
      trigger={null}
      collapsible
      collapsedWidth={0}
    >
      {/* Header */}
      <div style={estilos.header}>
        <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span role="img" aria-label="herramientas">🔧</span>
          Guía Técnica
        </Title>
      </div>
      
      {/* Barra de búsqueda */}
      <div style={estilos.search}>
        <Input
          className="input-busqueda"
          placeholder="Buscar en la documentación..."
          prefix={<SearchOutlined style={{ color: token.colorTextDisabled }} />}
          suffix={
            busqueda && (
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined style={{ fontSize: 12 }} />}
                onClick={handleClearSearch}
                style={{ marginRight: -8 }}
              />
            )
          }
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={estilos.searchInput}
          allowClear
        />
      </div>
      
      {/* Contenido principal */}
      <div style={estilos.content}>
        {renderSearchResults}
        {renderSectionNavigation}
      </div>
      
      {/* Footer con estadísticas */}
      <div style={estilos.footer}>
        <div style={{ marginBottom: 4 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {estadisticas.totalSecciones} secciones • {estadisticas.totalSubtemas} subtemas
          </Text>
        </div>
        <Space size={4}>
          <BulbOutlined style={{ fontSize: 12 }} />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Usa Ctrl+K para buscar rápidamente
          </Text>
        </Space>
      </div>
    </Sider>
  );
};

export default Sidebar;