import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Space, Grid, theme } from 'antd';
import { BookOutlined, FolderOutlined } from '@ant-design/icons';
import type { Seccion } from '../../feature/types';
import { allSections } from '../../feature/data';

const { Title, Text } = Typography;
const { useToken } = theme;
const { useBreakpoint } = Grid;

const HomePage: React.FC = () => {
  const { token } = useToken();
  const screens = useBreakpoint();
  const navigate = useNavigate();

  // Verificar si los datos ya están en el nuevo formato o necesitan transformación
  const secciones = React.useMemo<Seccion[]>(() => {
    if (allSections.length > 0 && 'subtemas' in allSections[0]) {
      return allSections as Seccion[];
    }
    // Si necesitas transformar los datos, puedes importar la función aquí
    return allSections as Seccion[];
  }, []);

  const handleCardClick = (seccion: Seccion) => {
    navigate(`/guide/${seccion.id}`);
  };

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: '24px 16px',
      minHeight: 'calc(100vh - 64px)'
    }}>
      <div style={{ marginBottom: token.marginLG }}>
        <Title level={2} style={{ marginBottom: token.marginXS }}>
          <BookOutlined style={{ marginRight: 12, color: token.colorPrimary }} />
          Guías Técnicas
        </Title>
        <Text type="secondary">
          Selecciona una guía para comenzar a explorar la documentación técnica.
        </Text>
      </div>

      <div style={{ marginTop: token.marginLG }}>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: screens.xl ? 'repeat(3, 1fr)' : 
                               screens.md ? 'repeat(2, 1fr)' : '1fr',
            gap: 16,
          }}
        >
          {secciones.map((seccion) => (
            <Card
              key={seccion.id}
              hoverable
              onClick={() => handleCardClick(seccion)}
              style={{
                borderRadius: token.borderRadiusLG,
                border: `1px solid ${token.colorBorderSecondary}`,
                transition: 'all 0.3s',
              }}
              bodyStyle={{
                padding: token.paddingLG,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <Space size="middle" style={{ marginBottom: token.marginSM }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: token.colorPrimaryBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {seccion.icono || <FolderOutlined style={{ fontSize: 20, color: token.colorPrimary }} />}
                </div>
                <Title level={4} style={{ margin: 0 }}>{seccion.titulo}</Title>
              </Space>
              <Text type="secondary" style={{ flex: 1 }}>
                {seccion.descripcion || 'Explora los temas y subtemas de esta guía técnica.'}
              </Text>
              <div style={{ marginTop: token.marginSM }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {seccion.subtemas?.length || 0} temas • Última actualización: {new Date().toLocaleDateString()}
                </Text>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
