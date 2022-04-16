import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.palette.background.darker};
  display: flex;
  flex-direction: column;
  width: 250px;
  max-width: 250px;
  box-shadow: ${({ theme }) => theme.shadows[1]};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
`;

export const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(1)};
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
`;
