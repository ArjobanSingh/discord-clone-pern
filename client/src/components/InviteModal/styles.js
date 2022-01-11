import styled from 'styled-components';
import Select from '@mui/material/Select';
import Icon from '@mui/material/Icon';

export const InviteModalContainer = styled.div(({ theme }) => `
  border-radius: ${theme.shape.borderRadius}px;
  background: ${theme.palette.background.default};
  color: ${theme.palette.text.primary};
  padding: ${theme.spacing(2)};
  position: relative;

  ${theme.breakpoints.up('xs')} {
    width: 22.5rem;
  };

  ${theme.breakpoints.up('sm')} {
    width: 30rem;
  };
`);

export const StyledSelect = styled(Select)(({ theme }) => `
  height: 41px;
  width: 100%;
  border-radius: ${theme.shape.borderRadius}px;
  background: ${theme.palette.input.background};
  color: ${theme.palette.text.primary};

  .MuiSelect-select {
    padding: 0 8px;
  }

  & .MuiOutlinedInput-notchedOutline,
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${theme.palette.input.borderColor} !important;
    border: 1px solid ${theme.palette.input.borderColor};
  }
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
