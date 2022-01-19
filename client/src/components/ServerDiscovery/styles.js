import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  // overflow: auto;
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
