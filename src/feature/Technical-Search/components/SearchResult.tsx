// src/feature/Technical-Search/components/SearchResult.tsx
import React from 'react';
import { Typography, List, Tag, Space } from 'antd';
import type { ResultadoBusqueda } from '../../types';
import { highlightText } from '../utils/textUtils';

const { Text } = Typography;

interface SearchResultProps {
  resultado: ResultadoBusqueda;
  onClick: () => void;
  searchTerm: string;
}

const typeColors: Record<ResultadoBusqueda['tipo'], string> = {
  seccion: 'blue',
  subtema: 'geekblue',
  item: 'green',
  texto: 'orange',
  codigo: 'purple'
};

/**
 * Componente para mostrar un resultado individual de búsqueda
 * Aplica resaltado al término buscado y muestra información contextual
 */
export const SearchResult: React.FC<SearchResultProps> = ({ 
  resultado, 
  onClick, 
  searchTerm 
}) => {
  const getTypeIcon = (tipo: ResultadoBusqueda['tipo']): string => {
    const icons: Record<ResultadoBusqueda['tipo'], string> = {
      seccion: '📁',
      subtema: '📌',
      item: '📄',
      texto: '📝',
      codigo: '💻'
    };
    return icons[tipo] || '📋';
  };

  const getTypeLabel = (tipo: ResultadoBusqueda['tipo']): string => {
    const labels: Record<ResultadoBusqueda['tipo'], string> = {
      seccion: 'Sección',
      subtema: 'Subtema',
      item: 'Item',
      texto: 'Texto',
      codigo: 'Código'
    };
    return labels[tipo] || 'Contenido';
  };

  return (
    <List.Item
      onClick={onClick}
      className="search-result-item"
      style={{
        padding: '12px 16px',
        cursor: 'pointer',
        borderBottom: '1px solid #f0f0f0',
        transition: 'all 0.3s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fafafa')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'inherit')}
      actions={[
        <Space key="type" size="small">
          <Tag color={typeColors[resultado.tipo]}>
            {getTypeIcon(resultado.tipo)} {getTypeLabel(resultado.tipo)}
          </Tag>
        </Space>
      ]}
    >
      <List.Item.Meta
        title={
          <div style={{ marginBottom: 4 }}>
            {highlightText(resultado.texto, searchTerm)}
          </div>
        }
        description={
          resultado.path && resultado.path.length > 0 && (
            <Text type="secondary" ellipsis>
              {resultado.path.join(' › ')}
            </Text>
          )
        }
      />
    </List.Item>
  );
};

export default SearchResult;