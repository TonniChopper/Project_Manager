// filepath: c:\Project_Manager\frontend\src\components\chat\FilePreview.jsx
import React from 'react';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Card = styled.a`
  display: block;
  text-decoration: none;
  color: inherit;
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.background.elevated};
`;

const Thumb = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background: ${({ theme }) => theme.background.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Meta = styled.div`
  padding: 6px 8px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.text.secondary};
`;

export default function FilePreview({ files = [] }) {
  if (!files.length) return null;
  return (
    <Grid>
      {files.map(f => (
        <Card key={f.id} href={f.url} target="_blank" rel="noreferrer">
          <Thumb>{f.type === 'image' ? <img alt={f.name} src={f.url} /> : '📄'}</Thumb>
          <Meta>{f.name}</Meta>
        </Card>
      ))}
    </Grid>
  );
}
