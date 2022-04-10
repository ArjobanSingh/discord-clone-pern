import styled from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';

const ChatInputField = styled(TextareaAutosize)(({ theme }) => `
  resize: none;
  min-height: 40px;
  max-height: 200px;
  width: 100%;
  border: 1px solid ${theme.palette.input.borderColor};
  background: ${theme.palette.input.background};
  border-radius: ${theme.shape.borderRadius}px;
  color: ${theme.palette.text.secondary};
  padding: ${theme.spacing(1)};
  font-size: ${theme.typography.body1.fontSize};
  overflow-y: auto;
`);

export default ChatInputField;
