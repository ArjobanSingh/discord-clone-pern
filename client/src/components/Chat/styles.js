import styled from 'styled-components';

export const ChatContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const MessagesContainer = styled.div`
  flex: 1 1 auto;
  position: relative;
`;

// 36 for reply box, 250 for files if selected and 80 maximum for text field
// when other files and reply is selected as well
const maxInputHeight = 36 + 250 + 80;
export const InputContainer = styled.div`
  min-height: 40px;
  max-height: ${maxInputHeight}px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2)};
  padding-top: 0;
`;
