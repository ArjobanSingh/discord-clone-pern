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

export const DiscoveryContainer = styled.div`
  flex-direction: column;
  width: 100%;
  justify-content: unset;
  padding: ${({ theme }) => theme.spacing(5)};
  max-width: 93.75rem;
  display: flex;
  gap: 20px;

  & > img {
    display: none;
    ${({ theme }) => theme.breakpoints.up('sm')} {
      display: inline;
    };
  }
`;
