// src/feature/Technical-Search/components/CodeBlock.tsx
import React, { useMemo, useState } from 'react';
import { Button, Card, Space, Typography, theme } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';

const { useToken } = theme;
const { Text } = Typography;

interface CodeBlockProps {
  code: string;
  searchTerm: string;
  language?: string;
}

/**
 * Componente para mostrar bloques de código con resaltado de sintaxis
 * Incluye funcionalidad de copiado y resaltado de términos de búsqueda
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  code, 
  searchTerm, 
  language = 'typescript' 
}) => {
  const [copied, setCopied] = useState(false);

  const highlightedCode = useMemo(() => {
    if (!searchTerm.trim()) return code;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return code.replace(regex, '<mark class="code-highlight">$1</mark>');
  }, [code, searchTerm]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar código:', err);
    }
  };

  const getLanguageLabel = (lang: string): string => {
    const labels: Record<string, string> = {
      typescript: 'TypeScript',
      javascript: 'JavaScript',
      python: 'Python',
      java: 'Java',
      csharp: 'C#',
      sql: 'SQL',
      json: 'JSON',
      xml: 'XML',
      html: 'HTML',
      css: 'CSS'
    };
    return labels[lang.toLowerCase()] || lang;
  };

  const { token } = useToken();

  const codeStyle: React.CSSProperties = {
    position: 'relative',
    borderRadius: token.borderRadius,
    border: `1px solid ${token.colorBorder}`,
    backgroundColor: token.colorBgContainer,
    overflow: 'hidden',
    margin: `${token.marginSM}px 0`,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${token.paddingXS}px ${token.paddingSM}px`,
    backgroundColor: token.colorFillAlter,
    borderBottom: `1px solid ${token.colorBorder}`,
  };

  const dotsStyle: React.CSSProperties = {
    display: 'flex',
    gap: 6,
  };

  const dotStyle = (color: string): React.CSSProperties => ({
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: color,
  });

  const contentStyle: React.CSSProperties = {
    padding: token.paddingSM,
    margin: 0,
    overflowX: 'auto',
  };

  return (
    <Card 
      size="small"
      style={codeStyle}
      bodyStyle={{ padding: 0 }}
      bordered={false}
    >
      <div style={headerStyle}>
        <Space size="small">
          <div style={dotsStyle}>
            <div style={dotStyle('#ff5f56')} />
            <div style={dotStyle('#ffbd2e')} />
            <div style={dotStyle('#27c93f')} />
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {getLanguageLabel(language)}
          </Text>
        </Space>
        <Button
          type="text"
          size="small"
          icon={copied ? <CheckOutlined style={{ color: token.colorSuccess }} /> : <CopyOutlined />}
          onClick={handleCopy}
          title={copied ? 'Copiado!' : 'Copiar código'}
          aria-label={copied ? 'Código copiado' : 'Copiar código'}
          style={{ height: 24 }}
        />
      </div>
      <pre style={contentStyle}>
        <code 
          className={`language-${language}`}
          style={{ 
            fontFamily: 'monospace',
            whiteSpace: 'pre',
            margin: 0,
            padding: 0,
          }}
          dangerouslySetInnerHTML={{
            __html: highlightedCode
          }}
        />
      </pre>
    </Card>
  );
};

export default CodeBlock;