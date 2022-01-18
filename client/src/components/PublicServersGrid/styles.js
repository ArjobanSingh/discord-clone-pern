import styled from 'styled-components';

export const Grid = styled('div')`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(20.5rem, 1fr));
  place-items: center;
  grid-gap: 1rem;
`;

export const GridTile = styled('div')(({ theme }) => `
  height: 300px;
  width: 100%;
  background-color: ${theme.palette.background.paper};
  transition: background-color 0.2s ease-out, transform 0.2s;
  border-radius: ${theme.shape.borderRadius}px;
  box-shadow: ${theme.shadows[1]};

  &:hover {
    background-color: ${theme.palette.background.darker};
    transform: scale(1.01);
    cursor: pointer;
  }
`);
