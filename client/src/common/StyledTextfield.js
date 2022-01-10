import PropTypes from 'prop-types';
import styled from 'styled-components';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

const dummyThemeFunc = () => '';

const Input = styled('input')`
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: inherit;
  font-size: inherit;
`;

const InputWrapper = styled.div(({
  theme, width, error, injectCss = dummyThemeFunc,
}) => `
  width: ${width || ''};
  display: flex;
  border: 1px solid ${error ? theme.palette.error.light : theme.palette.input.borderColor};
  background: ${theme.palette.input.background};
  border-radius: ${theme.shape.borderRadius}px;
  color: ${theme.palette.text.secondary};
  padding: ${theme.spacing(1)};
  font-size: ${theme.typography.body1.fontSize};
  gap: 10px;
  align-items: center;

  ${injectCss(theme)}
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
    <InputWrapper injectCss={injectCss}>
      {startIcon}
      <Input id={id} {...rest} error={isError ? 'error' : ''} />
      {endIcon}
    </InputWrapper>
  </>
);

StyledTextfield.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  isError: PropTypes.bool,
  errorMessage: PropTypes.string,
  injectCss: PropTypes.func,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
};

StyledTextfield.defaultProps = {
  isError: false,
  errorMessage: null,
  label: null,
  injectCss: dummyThemeFunc,
  startIcon: null,
  endIcon: null,
};

export default StyledTextfield;
