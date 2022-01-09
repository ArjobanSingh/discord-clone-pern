import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

const dummyThemeFunc = () => '';

const Input = styled('input')(({
  theme, themeFunc = dummyThemeFunc, error, width = '',
}) => `
  width: ${width};
  color: ${theme.palette.text.secondary};
  font-size: ${theme.typography.body1.fontSize};
  border: 1px solid ${error ? theme.palette.error.light : theme.palette.input.borderColor};
  padding: ${theme.spacing(1)};
  background: ${theme.palette.input.background};
  border-radius: ${theme.shape.borderRadius}px;

  ${themeFunc(theme)}
`);

const ErrorDash = styled('span')`
  padding-inline: 5px;
`;

const StyledLabel = styled(InputLabel)`
  width: fit-content;
`;

const StyledTextfield = ({
  id, label, isError, errorMessage, ...rest
}) => (
  <>
    <StyledLabel htmlFor={id}>
      <Typography
        variant="body2"
        color={isError ? 'error.light' : 'text.secondary'}
        component="span"
      >
        {label}
      </Typography>
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
    <Input id={id} {...rest} error={isError ? 'error' : ''} />
  </>
);

StyledTextfield.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isError: PropTypes.bool,
  errorMessage: PropTypes.string,
};

StyledTextfield.defaultProps = {
  isError: false,
  errorMessage: null,
};

export default StyledTextfield;
