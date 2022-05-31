import styled from 'styled-components';

export const Wrapper = styled.div`
  cursor: pointer;
  position: relative;
  touch-action: pan-x;
  user-select: none;
`;

export const InputWrapper = styled.div(({ theme }) => `
  background-color: ${theme.palette.background.default};
  border-radius: 30px;
  height: 1.5rem;
  transition: .2s;
  width: 3.125rem;
`);

export const InputCheckbox = styled.input`
  clip: rect(0 0 0 0);
  border: 0;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  position: absolute;
  width: 1px;
  padding: 0;
`;

export const GenericWrapper = styled.div(({ isVisible }) => `
  opacity: ${isVisible ? '1' : '0'};
  transition: opacity .25s;
  
  bottom: 0;
  height: 10px;
  margin: auto 0;
  top: 0;
  position: absolute;
`);

export const MoonIconWrapper = styled(GenericWrapper)`
  left: 0.5rem;
  width: 0.875rem;
`;

export const SunIconWrapper = styled(GenericWrapper)`
  right: 10px;
  width: 0.625rem;
`;

export const IconSpan = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 0.625rem;
  width: 0.625rem;
`;

export const ToggleBall = styled.div(({ isDarkMode, theme }) => `
  background-color: ${theme.palette.text.primary};
  border: 1px solid #4d4d4d;
  border-radius: 50%;
  height: 22px;
  position: absolute;
  top: 1px;
  transition: .25s;
  width: 22px;
  left: ${isDarkMode ? '27px' : '1px'};

  &:hover {
    box-shadow: 0 0 2px 3px ${theme.palette.primary.main};
  }
`);
