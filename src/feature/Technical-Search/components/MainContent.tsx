import React from 'react';
import { Card, Typography, Button, Result, Space } from 'antd';
import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import type { Seccion, Subtema } from '../../types';
import ContentItem from './ContentItem';
import Breadcrumb from './Breadcrumb';
import SubtemaSection from './SubtemaSection';
import { highlightText } from '../utils/textUtils';

const { Title, Text, Paragraph } = Typography;

interface MainContentProps {
  secciones: Seccion[];
  seccionActiva: string;
  subtemaActivo: string;
  searchTerm: string;
  subtemasExpandidos: Set<string>;
  toggleSubtema: (subtemaId: string) => void;
}

/**
 * Componente principal que muestra el contenido de la sección/subtema activo
 * Soporta vista de sección completa o subtema específico
 */
export const MainContent: React.FC<MainContentProps> = ({ 
  secciones, 
  seccionActiva, 
  subtemaActivo, 
  searchTerm,
  subtemasExpandidos,
  toggleSubtema
}) => {
  const seccion = secciones.find(s => s.id === seccionActiva);
  const subtema = seccion?.subtemas.find(st => st.id === subtemaActivo);
  
  if (!seccion) {
    return <ErrorContent />;
  }
  
  return (
    <main className="contenido-principal" role="main">
      <Card style={{ margin: '16px', borderRadius: '8px' }}>
        <Breadcrumb seccion={seccion} subtema={subtema} />
        
        <div style={{ margin: '16px 0' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
              {seccion.icono && <span style={{ fontSize: '1.5em' }}>{seccion.icono}</span>}
              <span dangerouslySetInnerHTML={{ 
                __html: highlightText(seccion.titulo, searchTerm) || ''
              }} />
            </Title>
            {seccion.descripcion && (
              <Paragraph type="secondary" style={{ margin: 0 }}>
                <span dangerouslySetInnerHTML={{ 
                  __html: highlightText(seccion.descripcion, searchTerm) || ''
                }} />
              </Paragraph>
            )}
            {searchTerm && <SearchInfo searchTerm={searchTerm} />}
          </Space>
        </div>
        
        {subtema ? (
          <SubtemaView subtema={subtema} searchTerm={searchTerm} />
        ) : (
          <SeccionOverview 
            seccion={seccion}
            searchTerm={searchTerm}
            subtemasExpandidos={subtemasExpandidos}
            toggleSubtema={toggleSubtema}
          />
        )}
      </Card>
    </main>
  );
};

/**
 * Vista de error cuando no se encuentra la sección
 */
const ErrorContent: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <Result
      status="404"
      title="Sección no encontrada"
      subTitle="La sección solicitada no existe o ha sido movida."
      extra={
        <Button 
          type="primary" 
          icon={<HomeOutlined />}
          onClick={() => window.location.reload()}
        >
          Volver al inicio
        </Button>
      }
    />
  </div>
);

/**
 * Indicador de búsqueda activa
 */
const SearchInfo: React.FC<{ searchTerm: string }> = ({ searchTerm }) => (
  <div style={{ marginTop: 8 }}>
    <Text type="secondary">
      <SearchOutlined /> Buscando: "{searchTerm}"
    </Text>
  </div>
);

/**
 * Vista de un subtema específico
 */
const SubtemaView: React.FC<{
  subtema: Subtema;
  searchTerm: string;
}> = ({ subtema, searchTerm }) => (
  <Card style={{ marginTop: 16 }}>
    <div style={{ marginBottom: 16 }}>
      <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        {subtema.icono && <span style={{ fontSize: '1.2em' }}>{subtema.icono}</span>}
        <span dangerouslySetInnerHTML={{ 
          __html: highlightText(subtema.titulo, searchTerm) || ''
        }} />
      </Title>
    </div>
    
    <div>
      {subtema.items.map((item, index) => (
        <div 
          key={index}
          data-subsection={item.subtitulo}
          style={{ marginBottom: 16 }}
        >
          <ContentItem item={item} searchTerm={searchTerm} />
        </div>
      ))}
    </div>
  </Card>
);

/**
 * Vista general de una sección con todos sus subtemas
 */
const SeccionOverview: React.FC<{
  seccion: Seccion;
  searchTerm: string;
  subtemasExpandidos: Set<string>;
  toggleSubtema: (subtemaId: string) => void;
}> = ({ seccion, searchTerm, subtemasExpandidos, toggleSubtema }) => (
  <div style={{ marginTop: 16 }}>
    {seccion.subtemas.map((subtemaItem) => (
      <SubtemaSection
        key={subtemaItem.id}
        subtema={subtemaItem}
        searchTerm={searchTerm}
        isActive={subtemasExpandidos.has(subtemaItem.id)}
        onToggle={() => toggleSubtema(subtemaItem.id)}
      />
    ))}
  </div>
);

export default MainContent;