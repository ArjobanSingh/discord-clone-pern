import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

const dummyThemeFunc = () => '';

const Input = styled('input')(({ theme, themeFunc = dummyThemeFunc, width = '' }) => `
  width: ${width};
  color: ${theme.palette.text.secondary};
  font-size: ${theme.typography.body1.fontSize};
  border: 1px solid ${theme.palette.input.borderColor};
  padding: ${theme.spacing(1)};
  background: ${theme.palette.input.background};
  border-radius: ${theme.shape.borderRadius}px;

  ${themeFunc(theme)}
`);

const StyledLabel = styled(InputLabel)`
  width: fit-content;
`;

const StyledTextfield = ({ id, label, ...rest }) => (
  <>
    <StyledLabel htmlFor={id}>
      <Typography variant="body2" color="text.secondary" width="fit-content">
        {label}
      </Typography>
    </StyledLabel>
    <Input id={id} {...rest} />
  </>
);

StyledTextfield.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default StyledTextfield;
