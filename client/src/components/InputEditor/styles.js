import styled from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';
import { forwardRef } from 'react';

// just random function, how styled components would have implemented
// const customStyled = (WrappedComponent) => (cssFunc) => {
//   const StyledComponent = (props) => {
//     const { className, ...rest } = props;
//     some kind of custom Hook to get theme for styled component
//     const theme = useAppTheme();

//     which creates the new class based on css, theme and props
//     const classes = createClasses(cssFunc, props, theme);

//     // merge our new generated className to already passed className in props(if user pass some custom class as well)
//     const newClassName = mergeClasses(classes, className);

//     return (
//       <WrappedComponent
//         {...rest}
//         className={newClassName}
//       />
//     );
//   };
//   return StyledComponent;
// };

// eslint-disable-next-line react/prop-types

const iconDivWidth = '40px';

// eslint-disable-next-line react/prop-types
const TextAreaWrapper = forwardRef(({ isReply, isFiles, ...rest }, ref) => (
  <TextareaAutosize ref={ref} {...rest} />
));

const ChatInputField = styled(TextAreaWrapper)(({ theme, isReply, isFiles }) => `
  resize: none;
  min-height: 40px;
  max-height: ${isFiles && isReply ? '64px' : '200px'};
  flex: 1;
  color: ${theme.palette.text.secondary};
  padding: ${theme.spacing(1)};
  font-size: ${theme.typography.body1.fontSize};
  overflow-y: auto;
  border: none;
  background-color: inherit;
  border-radius: inherit;
  padding-left: ${iconDivWidth};
  line-height: 1.5;
`);

export const TextWrapper = styled.div(({ theme, hideTopRadius }) => `
  display: flex;
  border: 1px solid ${theme.palette.input.borderColor};
  background-color: ${theme.palette.input.background};
  border-radius: ${theme.shape.borderRadius}px;
  position: relative;

  ${hideTopRadius
    ? `
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    `
    : ''}
`);

export const UploadIconWrapper = styled.div`
  position: absolute;
  width: ${iconDivWidth};
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const FileInput = styled.input`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
  z-index: 10;
  font-size: 0;
`;

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

export const FilesContainer = styled.div`
  width: 100%;
  display: flex;
  overflow: auto hidden;
  background-color: ${({ theme }) => theme.palette.input.background};
  height: 250px;
  max-height: 250px;
  display: flex;
  gap: 20px;
  padding: 20px;
`;

export default ChatInputField;
