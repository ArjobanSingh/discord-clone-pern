import styled from 'styled-components';

export const ImageMessageContainer = styled.div(({ theme }) => `
  padding-block: ${theme.spacing(0.5)};
`);

export const ImageContainer = styled.div(({ theme, width, height }) => `
  position: relative;
  width: ${width}px;
  height: ${height}px;
  border-radius: ${theme.shape.borderRadius}px;
`);

export const StyledImage = styled.img`
    width: 100%;
    height: 100%;
    position: ${({ position }) => position};
    opacity: ${({ opacity }) => opacity};
    border-radius: inherit;
`;
