import PropTypes from 'prop-types';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { UnsavedWrapper } from './styles';
import { useSnackbarValues } from './SnackbarProvider';

const UnsavedSnackBar = ({ handleSubmit, isSubmitting }) => {
  const { isSnackbarOpen, setReset, setIsSnackbarOpen } = useSnackbarValues();
  const handleReset = () => {
    if (isSubmitting) return;
    setReset(true);
    setIsSnackbarOpen(false);
  };

  const submitChanges = (e) => {
    if (isSubmitting) return;
    handleSubmit(e);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={isSnackbarOpen}
    >
      <UnsavedWrapper>
        <Typography
          fontWeight="fontWeightBold"
        >
          Careful — you have unsaved changes!
        </Typography>
        <Box display="flex" gap={(theme) => theme.spacing(1)}>
          <Button
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
            variant="text"
            color="info"
            onClick={handleReset}
          >
            Reset
          </Button>

          <Button variant="contained" color="success" onClick={submitChanges}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </UnsavedWrapper>
    </Snackbar>
  );
};

UnsavedSnackBar.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export default UnsavedSnackBar;
