import styled from 'styled-components';
import Icon from '@mui/material/Icon';
import FormControlLabel from '@mui/material/FormControlLabel';

export const ModalContainer = styled.div(({ theme }) => `
  border-radius: ${theme.shape.borderRadius}px;
  background: ${theme.palette.background.default};

  &:focus-visible {
      outline: none;
  }

  ${theme.breakpoints.up('xs')} {
    width: 22.5rem;
  };

  ${theme.breakpoints.up('sm')} {
    width: 30rem;
  };
`);

export const ContentWrapper = styled.div(({ theme }) => `
  color: ${theme.palette.text.primary};
  padding: ${theme.spacing(2)};
  position: relative;
`);

export const IconWrapper = styled(Icon)(({ theme }) => `
  position: absolute;
  right: ${theme.spacing(2)};
  color: ${theme.palette.text.secondaryDark};

  &:hover {
    color: ${theme.palette.text.primary};
    cursor: pointer;
  }
`);

export const Upload = styled.div`
  width: 80px;
  height: 80px;
  position: relative;
  margin-block: ${({ theme }) => theme.spacing(2)};
`;

export const FileInput = styled.input`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
`;

export const Form = styled.form`
  width: 100%;
  display: grid;
  gap: 10px;
`;

export const SwitchLabel = styled(FormControlLabel)`
  width: 100%;
  margin: 0;
  justify-content: space-between;
`;

export const ModalFooter = styled.footer(({ theme }) => `
  width: 100%;
  padding: ${theme.spacing(2)};
  background-color: ${theme.palette.background.paper};
  display: flex;
  justify-content: flex-end;
  border-bottom-left-radius: ${theme.shape.borderRadius}px;
  border-bottom-right-radius: ${theme.shape.borderRadius}px;
`);
