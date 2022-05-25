import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Zoom from '@mui/material/Zoom';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden auto;
  display: flex;
  flex-direction: column;
`;

const InnerContainer = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(2)};
`;

const TransitionModal = (props) => {
  const { children, open, ...rest } = props;
  return (
    <Modal
      open={open}
      closeAfterTransition
      {...rest}
    >
      <Container>
        <InnerContainer>
          <Zoom in={open}>{children}</Zoom>
        </InnerContainer>
      </Container>
    </Modal>
  );
};

TransitionModal.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
};

export default TransitionModal;
