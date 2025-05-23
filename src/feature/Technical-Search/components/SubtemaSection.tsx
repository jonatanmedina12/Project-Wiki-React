// src/components/BuscadorTecnico/components/SubtemaSection.tsx
import React from 'react';
import { Collapse, Space, Typography, theme } from 'antd';
import { RightOutlined, DownOutlined, TagOutlined } from '@ant-design/icons';
import type { Subtema } from '../../types';
import ContentItem from './ContentItem';
import { highlightText } from '../utils/textUtils';

const { Panel } = Collapse;
const { Text } = Typography;
const { useToken } = theme;

interface SubtemaSectionProps {
  subtema: Subtema;
  searchTerm: string;
  isActive: boolean;
  onToggle: () => void;
}

/**
 * Componente para mostrar un subtema colapsable con Ant Design
 * Muestra el título y contenido cuando está expandido
 */
export const SubtemaSection: React.FC<SubtemaSectionProps> = ({
  subtema,
  searchTerm,
  isActive,
  onToggle,
}) => {
  const { token } = useToken();
  
  const customExpandIcon = ({ isActive }: { isActive?: boolean }) => (
    <div style={{ marginRight: 8 }}>
      {isActive ? <DownOutlined /> : <RightOutlined />}
    </div>
  );

  const header = (
    <Space size="middle" align="start">
      {subtema.icono ? (
        <span style={{ fontSize: '1.1em' }}>{subtema.icono}</span>
      ) : (
        <TagOutlined style={{ color: token.colorPrimary }} />
      )}
      <Text
        style={{
          fontWeight: 500,
          color: isActive ? token.colorPrimary : token.colorText,
        }}
      >
        {highlightText(subtema.titulo, searchTerm)}
      </Text>
    </Space>
  );

  return (
    <div className="subtema-section">
      <Collapse
        bordered={false}
        activeKey={isActive ? ['1'] : []}
        onChange={onToggle}
        expandIcon={customExpandIcon}
        className="subtema-collapse"
        style={{
          background: 'transparent',
          border: 'none',
          marginBottom: token.marginSM,
        }}
      >
        <Panel
          header={header}
          key="1"
          showArrow={false}
          style={{
            background: isActive ? token.colorFillAlter : 'transparent',
            borderRadius: token.borderRadiusLG,
            border: 'none',
          }}
          className="subtema-panel"
        >
          <div 
            className="subtema-content"
            style={{
              padding: `${token.paddingXS}px 0 ${token.paddingXS}px ${token.marginLG}px`,
              borderLeft: `2px solid ${token.colorBorderSecondary}`,
              marginLeft: token.marginXS,
            }}
          >
            {subtema.items.map((item, index) => (
              <ContentItem
                key={`${subtema.id}-${index}`}
                item={item}
                searchTerm={searchTerm}
              />
            ))}
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default SubtemaSection;