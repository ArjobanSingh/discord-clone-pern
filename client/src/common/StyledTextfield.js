import PropTypes from 'prop-types';
import styled from 'styled-components';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

const Input = styled('input')`
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: inherit;
  font-size: inherit;
`;

const InputWrapper = styled.div(({
  theme, width, isError, injectCss,
}) => `
  width: ${width || ''};
  display: flex;
  border: 1px solid ${isError ? theme.palette.error.light : theme.palette.input.borderColor};
  background: ${theme.palette.input.background};
  border-radius: ${theme.shape.borderRadius}px;
  color: ${theme.palette.text.secondary};
  padding: ${theme.spacing(1)};
  font-size: ${theme.typography.body1.fontSize};
  gap: 10px;
  align-items: center;

  &:focus-within {
    border: 1px solid ${isError ? theme.palette.error.light : theme.palette.primary.main};
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus input:-webkit-autofill,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
  border: none !important;
  -webkit-text-fill-color:  ${theme.palette.text.secondary} !important;
  -webkit-box-shadow: 0 0 0px 0px  ${theme.palette.input.background} inset;
  transition: background-color 5000s ease-in-out 0s;
}

  ${typeof injectCss === 'function' ? injectCss(theme) : injectCss}
`);

const ErrorDash = styled('span')`
  padding-inline: 5px;
`;

const StyledLabel = styled(InputLabel)`
  width: fit-content;
`;

const StyledTextfield = ({
  id, label, isError, errorMessage, injectCss, startIcon, endIcon, ...rest
}) => (
  <>
    <StyledLabel htmlFor={id}>
      {label}
      {!!errorMessage && (
      <Typography
        variant="caption"
        color="error.light"
        fontStyle="italic"
        fontWeight="600"
      >
        <ErrorDash>-</ErrorDash>
        {errorMessage}
      </Typography>
      )}
    </StyledLabel>
    <InputWrapper injectCss={injectCss} isError={isError}>
      {startIcon}
      <Input id={id} {...rest} />
      {endIcon}
    </InputWrapper>
  </>
);

StyledTextfield.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  isError: PropTypes.bool,
  errorMessage: PropTypes.string,
  injectCss: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
};

StyledTextfield.defaultProps = {
  isError: false,
  errorMessage: null,
  label: null,
  injectCss: '',
  startIcon: null,
  endIcon: null,
};

export default StyledTextfield;
