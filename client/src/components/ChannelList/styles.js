import styled from 'styled-components';
import { INVITE_USERS_ICON } from '../../constants/images';

export const ChannelListContainer = styled.div`
  height: 100%;
  width: 100%;
  max-width: 225px;
  overflow-x: hidden;
`;

export const InviteSectionWrapper = styled.section`
  padding: 80px 20px 20px;
  border-bottom: 0.5px solid ${({ theme }) => theme.palette.divider};
  text-align: center;
  position: relative;
  background: url(${INVITE_USERS_ICON}) no-repeat center 20px
`;

export const InviteSection = styled.div`
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: ${({ theme }) => theme.typography.subtitle2.fontSize};

  button {
    margin: 1rem auto 0;
  }
`;
