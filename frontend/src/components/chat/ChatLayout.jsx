// filepath: c:\Project_Manager\frontend\src\components\chat\ChatLayout.jsx
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  min-height: calc(100vh - 70px);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  background: ${({ theme }) => theme.background.glass};
  border: 1px solid ${({ theme }) => theme.border.glass};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadows.glass};
  overflow: hidden;
  height: fit-content;

  @media (max-width: 1024px) {
    order: 2;
  }
`;

const Main = styled.section`
  background: ${({ theme }) => theme.background.elevated};
  border: 1px solid ${({ theme }) => theme.border.light};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
`;

export default function ChatLayout({ sidebar, header, messages, composer }) {
  return (
    <Wrapper>
      <Sidebar>{sidebar}</Sidebar>
      <Main>
        {header}
        {messages}
        {composer}
      </Main>
    </Wrapper>
  );
}
