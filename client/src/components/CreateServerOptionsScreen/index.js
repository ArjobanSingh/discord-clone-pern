import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {
  ContentWrapper, IconWrapper, ModalContainer, ModalFooter,
} from '../CreateServerModal/styles';
import StyledTextfield from '../../common/StyledTextfield';
import { APP_URL } from '../../utils/axiosConfig';
import StyledImage from '../../common/StyledImage';
import { CREATE_SERVER_MODAL_ICON } from '../../constants/images';
import { getInviteId, handleEnter } from '../../utils/helperFunctions';
import { joinServerRequested } from '../../redux/actions/servers';
import { getJoinServerApi } from '../../redux/reducers';
import { AbsoluteProgress, ConfirmationButton } from '../ServerSettings/Options/styles';
import Error from '../../common/Error';
import useDidUpdate from '../../customHooks/useDidUpdate';

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const CreateServerWrapper = styled.div(({ theme }) => `
  width: 100%;
  border-radius: ${theme.shape.borderRadius}px;
  display: flex;
  justify-content: space-between;
  background-color: inherit;
  border: 1px solid ${theme.palette.background.paper};
  padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
  align-items: center;
  cursor: pointer;

  & > div {
    display: flex;
    gap: ${theme.spacing(1)};
    align-items: center;
  }

  &:hover {
    background-color: ${theme.palette.background.paper};
  }
`);

const CreateServerOptionsScreen = (props) => {
  const { closeModal, openServerModalMainScreen } = props;

  const dispatch = useDispatch();
  const [addedInviteId, setAddedInviteId] = useState('');
  const [serverJoinError, setServerJoinError] = useState();

  const joinServerApi = useSelector(
    (state) => getJoinServerApi(state, addedInviteId),
  ) || { isLoading: false, error: null };

  const { isLoading: isJoiningServer, error } = joinServerApi;

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (isJoiningServer) return;
    const formData = new FormData(e.currentTarget);
    const inviteUrl = formData.get('join-server-invite-input');
    if (!inviteUrl?.trim()) return;

    const inviteId = getInviteId(inviteUrl);
    setAddedInviteId(inviteId);
    dispatch(joinServerRequested({}, inviteId));
  };

  useDidUpdate(() => {
    setServerJoinError(error?.message || null);
  }, [error]);

  return (
    <ModalContainer>
      <ContentWrapper>
        <IconWrapper onClick={closeModal}>
          <CloseIcon />
        </IconWrapper>
        <Content>
          <TitleContainer>
            <Typography variant="h6" fontWeight="fontWeightDark" color="text.primary">
              Create a Server
            </Typography>
            <Typography
              id="create-server-description"
              textAlign="center"
              color="text.secondaryDark"
              variant="body2"
            >
              Your server is where you and your friends hang out. Make your and stark talking
            </Typography>
          </TitleContainer>

          <CreateServerWrapper
            role="button"
            tabIndex={0}
            onKeyDown={handleEnter(openServerModalMainScreen)}
            onClick={openServerModalMainScreen}
          >
            <div>
              <StyledImage
                src={CREATE_SERVER_MODAL_ICON}
              />
              <Typography fontWeight="fontWeightDark" color="text.primary">
                Create My Own
              </Typography>
            </div>
            <ArrowForwardIosIcon />
          </CreateServerWrapper>

          <Typography textAlign="center" fontWeight="fontWeightDark" color="text.primary">
            OR
          </Typography>

          <TitleContainer>
            <Typography textAlign="center" variant="h6" fontWeight="fontWeightDark" color="text.primary">
              Have an Invite already?
            </Typography>
            <Typography
              id="create-server-description"
              textAlign="center"
              color="text.secondaryDark"
              variant="body2"
            >
              Enter an invite below to join an existing server
            </Typography>
          </TitleContainer>

          <Form id="create-modal-join-server-form" onSubmit={handleInviteSubmit}>
            <div>
              <StyledTextfield
                id="create-server-modal-invite-input"
                placeholder="Enter an invite"
                name="join-server-invite-input"
                isError={!!serverJoinError}
                label={(
                  <Typography marginBottom="5px" variant="body2" color="text.secondary">
                    INVITE LINK
                  </Typography>
                )}
              />
            </div>
          </Form>

          <div>
            <Typography marginBottom="5px" variant="body2" color="text.secondary">
              INVITES SHOULD LOOK LIKE
            </Typography>
            {['v1stgxr8_z5jdhi6b-myt', `${APP_URL}/invite/v1stgxr8_z5jdhi6b-myt`].map((inviteType) => (
              <Typography variant="body2" key={inviteType} color="text.secondaryDark">
                {inviteType}
              </Typography>

            ))}
          </div>
        </Content>
        {!!serverJoinError && <Error>{serverJoinError}</Error>}
      </ContentWrapper>
      <ModalFooter>
        <ConfirmationButton
          form="create-modal-join-server-form"
          type="submit"
          variant="contained"
          isLoading={isJoiningServer}
        >
          <span className="button-text">
            Join Server
          </span>
          {isJoiningServer && <AbsoluteProgress color="inherit" size={20} />}
        </ConfirmationButton>
      </ModalFooter>
    </ModalContainer>
  );
};

CreateServerOptionsScreen.propTypes = {
  closeModal: PropTypes.func.isRequired,
  openServerModalMainScreen: PropTypes.func.isRequired,
};

export default CreateServerOptionsScreen;
// `${APP_URL}/invite/V1StGXR8_Z5jdHi6B-myT`
