// filepath: c:\Project_Manager\frontend\src\components\chat\MarkdownRenderer.jsx
import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Wrapper = styled.div`
  a {
    color: ${({ theme }) => theme.colors.accent};
  }
  code {
    background: ${({ theme }) => theme.background.tertiary};
    padding: 2px 6px;
    border-radius: ${({ theme }) => theme.radius.sm};
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.9em;
  }
  pre {
    background: ${({ theme }) => theme.background.tertiary};
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.radius.lg};
    overflow: auto;
  }
  ul,
  ol {
    padding-left: 1.25em;
  }
`;

export default function MarkdownRenderer({ children }) {
  return (
    <Wrapper>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </Wrapper>
  );
}
