import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Zoom from '@mui/material/Zoom';

const defaultSX = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const TransitionModal = (props) => {
  const { children, open, ...rest } = props;
  return (
    <Modal
      open={open}
      closeAfterTransition
      sx={defaultSX}
      {...rest}
    >
      <Zoom in={open}>{children}</Zoom>
    </Modal>
  );
};

TransitionModal.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
};

export default TransitionModal;
