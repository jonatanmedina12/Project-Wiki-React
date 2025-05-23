// src/feature/Technical-Search/components/ContentItem.tsx
import React from 'react';
import { Card, Typography, Image, Space } from 'antd';
import type { Item } from '../../types';
import { highlightText } from '../utils/textUtils';
import CodeBlock from './CodeBlock';

const { Title, Text, Paragraph } = Typography;

interface ContentItemProps {
  item: Item;
  searchTerm: string;
  style?: React.CSSProperties;
}

/**
 * Componente para renderizar un item de contenido
 * Soporta texto, listas, imágenes y bloques de código
 */
export const ContentItem: React.FC<ContentItemProps> = ({ item, searchTerm, style }) => {
  return (
    <Card 
      bordered={false} 
      style={{ 
        marginBottom: 24,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        ...style 
      }}
      bodyStyle={{ padding: '16px 24px' }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {item.subtitulo && (
          <Title level={4} style={{ marginBottom: 8 }}>
            {highlightText(item.subtitulo, searchTerm)}
          </Title>
        )}
        
        {item.texto && (
          <Paragraph style={{ marginBottom: item.items?.length ? 16 : 0 }}>
            {highlightText(item.texto, searchTerm)}
          </Paragraph>
        )}
        
        {item.items && item.items.length > 0 && (
          <ul style={{ 
            margin: 0, 
            paddingLeft: 24,
            listStyleType: 'circle'
          }}>
            {item.items.map((itemText, index) => (
              <li key={index} style={{ marginBottom: 8 }}>
                <Text>
                  {highlightText(itemText, searchTerm)}
                </Text>
              </li>
            ))}
          </ul>
        )}
        
        {item.imagen && (
          <div style={{ margin: '16px 0' }}>
            <Image
              src={item.imagen}
              alt={item.descripcionImagen || 'Imagen descriptiva'}
              style={{
                maxWidth: '100%',
                borderRadius: 4,
                border: '1px solid #f0f0f0'
              }}
              preview={{
                src: item.imagen,
                mask: 'Ver imagen'
              }}
            />
            {item.descripcionImagen && (
              <Text type="secondary" style={{ display: 'block', marginTop: 8, textAlign: 'center' }}>
                {highlightText(item.descripcionImagen, searchTerm)}
              </Text>
            )}
          </div>
        )}
        
        {item.codigo && (
          <div style={{ marginTop: 16 }}>
            <CodeBlock 
              code={item.codigo} 
              searchTerm={searchTerm}
              language={item.lenguaje || 'typescript'}
            />
          </div>
        )}
      </Space>
    </Card>
  );
};

export default ContentItem;