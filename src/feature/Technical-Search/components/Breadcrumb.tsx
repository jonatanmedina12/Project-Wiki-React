// src/components/BuscadorTecnico/components/Breadcrumb.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb as AntBreadcrumb, Typography, Space, theme } from 'antd';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';
import type { Seccion, Subtema } from '../../types';

const { useToken } = theme;
const { Text } = Typography;

interface BreadcrumbProps {
  seccion: Seccion;
  subtema?: Subtema;
}

/**
 * Componente de navegación breadcrumb mejorado con Ant Design
 * Muestra la ruta jerárquica de navegación actual
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ seccion, subtema }) => {
  const { token } = useToken();
  const navigate = useNavigate();
  
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };
  
  return (
    <AntBreadcrumb 
      separator={<RightOutlined style={{ color: token.colorTextDisabled }} />}
      style={{ marginBottom: token.marginMD }}
      className="breadcrumb-nav"
    >
      <AntBreadcrumb.Item>
        <Space size={4}>
          <HomeOutlined style={{ color: token.colorPrimary }} />
          <Text 
            type="secondary" 
            style={{ cursor: 'pointer', color: token.colorPrimary }}
            onClick={handleHomeClick}
          >
            Inicio
          </Text>
        </Space>
      </AntBreadcrumb.Item>
      
      <AntBreadcrumb.Item>
        <Text 
          type="secondary"
          style={{
            color: subtema ? token.colorText : token.colorTextHeading,
            fontWeight: subtema ? 'normal' : 500
          }}
        >
          {seccion.icono && <span style={{ marginRight: 8 }}>{seccion.icono}</span>}
          {seccion.titulo}
        </Text>
      </AntBreadcrumb.Item>
      
      {subtema && (
        <AntBreadcrumb.Item>
          <Text strong style={{ color: token.colorTextHeading }}>
            {subtema.icono && <span style={{ marginRight: 8 }}>{subtema.icono}</span>}
            {subtema.titulo}
          </Text>
        </AntBreadcrumb.Item>
      )}
    </AntBreadcrumb>
  );
};

export default Breadcrumb;