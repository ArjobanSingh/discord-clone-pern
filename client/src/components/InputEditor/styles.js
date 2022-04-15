import styled from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';

const ChatInputField = styled(TextareaAutosize)(({ theme, isReplying }) => `
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

  ${isReplying
    ? `
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    `
    : ''}
`);

export const ReplyInputContainer = styled.div(({ theme }) => `
  width: 100%;
  padding: ${theme.spacing(1)};
  background: ${theme.palette.background.darker};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: ${theme.shape.borderRadius}px;
  border-top-right-radius: ${theme.shape.borderRadius}px;
  font-size: ${theme.typography.subtitle2.fontSize};
  color: ${theme.palette.text.secondaryDark};
  cursor: pointer;

  span {
    color: ${theme.palette.text.primary};
  }

  svg {
    font-size: 20px;
  }
`);

export default ChatInputField;
