import styled from 'styled-components';

export const ChatContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(2)}`};
`;

export const MessagesContainer = styled.div`
  flex: 1;
  position: relative;
`;

export const InputContainer = styled.div`
  min-height: 40px;
  max-height: 300px;
  width: 100%;
`;
