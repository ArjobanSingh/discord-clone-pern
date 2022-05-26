import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Zoom from '@mui/material/Zoom';
import styled from 'styled-components';
import { stopPropagation } from '../../utils/helperFunctions';

const StyledModal = styled(Modal)`
  width: 100%;
  height: 100%;
  overflow: hidden auto;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(2)};
`;

const InnerContainer = styled.div``;

const TransitionModal = (props) => {
  const {
    children, open, innerContainerClassName, onClose, ...rest
  } = props;
  return (
    <StyledModal
      open={open}
      closeAfterTransition
      {...rest}
    >
      <Zoom in={open}>
        <Container onClick={onClose}>
          <InnerContainer className={innerContainerClassName} onClick={stopPropagation}>{children}</InnerContainer>
        </Container>
      </Zoom>
    </StyledModal>
  );
};

TransitionModal.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  innerContainerClassName: PropTypes.string,
};

TransitionModal.defaultProps = {
  innerContainerClassName: null,
};

export default TransitionModal;
