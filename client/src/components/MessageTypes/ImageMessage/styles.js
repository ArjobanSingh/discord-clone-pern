import styled from 'styled-components';

export const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  position: ${({ position }) => position};
  opacity: ${({ opacity }) => opacity};
  border-radius: inherit;
  filter: ${({ filter }) => filter};
`;
