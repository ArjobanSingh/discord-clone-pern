import styled from 'styled-components';

export const Grid = styled('div')`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(18.43rem, 1fr));
  place-items: center;
  grid-gap: 1rem;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    grid-template-columns: repeat(auto-fill,minmax(20.5rem, 1fr));
  };
`;

export const GridTile = styled('div')(({ theme }) => `
  height: 320px;
  width: 100%;
  background-color: ${theme.palette.background.paper};
  transition: background-color 0.2s ease-out, box-shadow 0.2s;
  border-radius: ${theme.shape.borderRadius * 2}px;
  box-shadow: ${theme.shadows[1]};
  display: relative;

  &:hover {
    background-color: ${theme.palette.background.darker};
    box-shadow: 0 8px 16px rgba(0,0,0,0.24);
    cursor: pointer;
  }
`);

export const ImageWrapper = styled.div`
  height: 10rem;
  width: 100%;
  border-radius: inherit;
`;

export const GridImage = styled.img`
  width: 100%;
  height: 100%;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  object-fit: cover;
`;

export const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: inherit;
`;

export const ContentWrapper = styled.div`
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

export const Dot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.palette.text.primary};
  margin-right: 7px;
`;
