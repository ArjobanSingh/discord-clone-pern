import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TransitionModal from '../TransitionModal';
import { SimpleEllipsis } from '../StyledComponents';

const Container = styled.div(({ theme }) => `
  background: ${theme.palette.background.default};
  border-radius: ${theme.shape.borderRadius}px;
  color: ${theme.palette.text.primary};
  padding-top: ${theme.spacing(2)};
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 40px;

  ${theme.breakpoints.up('xs')} {
    width: 22.5rem;
  };

  ${theme.breakpoints.up('sm')} {
    width: 25rem;
  };
`);

const MainContent = styled.div(({ theme }) => `
  width: 100%;
  padding-inline: ${theme.spacing(2)};
`);

const Footer = styled.footer(({ theme }) => `
  padding: ${theme.spacing(2)};
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background-color: ${theme.palette.background.paper};
`);

const ConfirmationModal = (props) => {
  const {
    title,
    description,
    onClose,
    onConfirm,
    confirmTitle,
    confirmButton,
    confirmButtonProps,
    ...rest
  } = props;

  return (
    <TransitionModal onClose={onClose} {...rest}>
      <Container>
        <MainContent>
          <Typography
            variant="h5"
            fontWeight="fontWeightMedium"
            color="text.primary"
            margin="0 0 10px"
            component="div"
          >
            <SimpleEllipsis>
              {title}
            </SimpleEllipsis>
          </Typography>

          <Typography fontWeight="normal" variant="body2" color="text.secondary">
            {description}
          </Typography>
        </MainContent>
        <Footer>
          <Button variant="info" color="text.primary" onClick={onClose}>
            Cancel
          </Button>
          {confirmButton || (
            <Button variant="contained" {...confirmButtonProps} onClick={onConfirm}>
              {confirmTitle}
            </Button>
          )}
        </Footer>
      </Container>
    </TransitionModal>
  );
};

ConfirmationModal.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.node.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  confirmButton: PropTypes.node,
  confirmTitle: PropTypes.node,
  confirmButtonProps: PropTypes.shape({}),
};

ConfirmationModal.defaultProps = {
  confirmTitle: 'Confirm',
  confirmButton: null,
  confirmButtonProps: {},
};

export default ConfirmationModal;
