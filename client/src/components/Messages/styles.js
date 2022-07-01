import styled from 'styled-components';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

export const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden scroll;
`;

export const MessagesWrapper = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: stretch;
  /* gap: 16px; */
`;

export const AbsoluteLoader = styled(CircularProgress)`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
`;

export const ImageModalWrapper = styled(Backdrop)`
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing(5)};
`;

// export const SingleMessageWrapper = styled.div`
//   width: 100%;
// `;
