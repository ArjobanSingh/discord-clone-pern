import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 50px);
  align-items: center;
  overflow: auto;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    height: 100%;
  };
`;

export const ImageWrapper = styled.div`
  max-height: 360px;
  width: 100%;
  position: relative;
`;

export const DiscoveryContainer = styled.div`
  flex-direction: column;
  width: 100%;
  justify-content: unset;
  padding: ${({ theme }) => theme.spacing(5)};
  max-width: 93.75rem;
  display: flex;
  gap: 20px;

  & ${ImageWrapper} {
    display: none;
    ${({ theme }) => theme.breakpoints.up('sm')} {
      display: inline;
    };
  }
`;

export const AbsoluteWrapperChild = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
