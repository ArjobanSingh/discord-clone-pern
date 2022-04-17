import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.palette.background.darker};
  display: flex;
  flex-direction: column;
  min-width: 250px;
  width: 250px;
  max-width: 250px;
  box-shadow: ${({ theme }) => theme.shadows[1]};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  position: relative;
  border: ${({ isSelected, theme }) => (isSelected
    ? `1px solid ${theme.palette.primary.main}` : '')};

  svg {
    color: ${({ theme }) => theme.palette.error.dark};
  }
`;

export const Column = styled.div`
  min-height: ${({ minHeight }) => minHeight};
  margin-top: auto;
`;

export const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(1)};
`;

export const Image = styled.img`
  object-fit: contain;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  ${({ isStatic }) => (!isStatic ? `
    max-width: 100%;
  ` : '')}
`;
