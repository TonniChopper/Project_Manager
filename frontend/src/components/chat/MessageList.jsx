// filepath: c:\Project_Manager\frontend\src\components\chat\MessageList.jsx
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';

const Scroll = styled.div`
  position: relative;
  overflow: auto;
  padding: ${({ theme }) => theme.spacing.lg};

  &::after {
    content: '';
    position: sticky;
    bottom: -1px;
    display: block;
    height: 16px;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 0%,
      ${({ theme }) => theme.background.elevated} 100%
    );
  }
`;

export default function MessageList({ children }) {
  const ref = useRef(null);

  // auto scroll to bottom on new messages
  useEffect(() => {
    const sc = ref.current;
    if (sc) {
      sc.scrollTo({ top: sc.scrollHeight, behavior: 'smooth' });
    }
  }, [children]);

  return (
    <Scroll as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} ref={ref}>
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </Scroll>
  );
}
