import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import { EllipsisDiv } from '../../../common/StyledComponents';

const BarHeight = 10;
const BarBorder = 2;
const ContentMarginBottom = (BarHeight + BarBorder) / 2;

export const ReferenceMessageContainer = styled.div`
   position: relative;
   display: flex;
   align-items: center;
   gap: 5px;
`;

export const Bar = styled.div(({ theme }) => `
  width: 30px;
  min-width: 30px;
  height: ${BarHeight}px;
  position: relative;
  margin-left: 20px;
  border-left: ${BarBorder}px solid ${theme.palette.text.secondaryDark};
  border-top: ${BarBorder}px solid ${theme.palette.text.secondaryDark};
  border-top-left-radius: 4px;
`);

export const ContentContainer = styled.div`
  font-size: ${({ theme }) => theme.typography.subtitle2.fontSize};
  padding-bottom: ${ContentMarginBottom}px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const StyledAvatar = styled(Avatar)(({
  theme,
}) => `
    width: 16px;
    height: 16px;
    background-color: ${theme.palette.primary.main};
    color: ${theme.palette.text.primary};
    font-size: 0.675rem;
  `);

export const UserName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeightBold};

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const ReferenceMessageContent = styled(EllipsisDiv)`
  flex: 1;
  font-style: ${({ isTextMessage }) => (isTextMessage ? '' : 'italic')};
  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export const AttachmentIcon = styled(ImageIcon)`
  width: 14px;
  height: 14px;
`;

export const ReferenceText = styled.div(({ theme }) => `
  font-size: ${theme.typography.subtitle2.fontSize};
  color: ${theme.palette.text.secondaryDark};
  display: flex;
  align-items: center;
  gap: 0.6ch;
`);
