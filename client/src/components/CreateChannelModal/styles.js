import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import FormControlLabel, { formControlLabelClasses } from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';

export const StyledCloseIcon = styled(CloseIcon)(({ theme }) => `
  color: ${theme.palette.text.secondary};
  cursor: pointer;

  &:hover {
    color: ${theme.palette.text.primary};
  }
`);

export const Container = styled.div(({ theme }) => `
  border-radius: ${theme.shape.borderRadius}px;
  background: ${theme.palette.background.default};
  color: ${theme.palette.text.primary};
  position: relative;

  ${theme.breakpoints.up('xs')} {
    width: 22.5rem;
  };

  ${theme.breakpoints.up('sm')} {
    width: 30rem;
  };
`);

export const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing(2)};
  width: 100%;
`;

export const Form = styled.form`
  width: 100%;
  display: grid;
  gap: 15px;
`;

export const ModalFooter = styled.footer`
  padding: ${({ theme }) => theme.spacing(2)};
  background: ${({ theme }) => theme.palette.background.paper};
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;

export const RadioLabel = styled(FormControlLabel)(({
  theme,
  selected,
  disabled,
}) => `
  width: 100%;
  margin: 0;
  background-color: ${selected
    ? theme.palette.background.darker
    : theme.palette.background.paper};
  border-radius: ${theme.shape.borderRadius}px;
  pointer-events: ${disabled ? 'none' : ''};
  opacity: ${disabled ? '0.5' : '1'};

  &:hover {
    background-color: ${theme.palette.background.darker};
  }

  .${formControlLabelClasses.label} {
    flex: 1;
    padding: ${theme.spacing(1.5)};
  }
`);

const LabelBody = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const LabelContainer = ({
  // eslint-disable-next-line react/prop-types
  icon, title, description, ...rest
}) => (
  <RadioLabel
    {...rest}
    control={<Radio />}
    label={(
      <LabelBody>
        {icon}
        <Box gap="10px" display="flex" flexDirection="column" justifyContent="center">
          <Typography color="text.primary" lineHeight={1}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" lineHeight={1}>
            {description}
          </Typography>
        </Box>
      </LabelBody>
    )}
  />
);
