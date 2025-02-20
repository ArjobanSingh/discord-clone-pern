import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ gap }) => gap || '5px'};
  align-items: center;
  width: 100%;
`;

export const logoSx = {
  backgroundColor: 'primary.main',
  color: 'text.primary',
  width: '80px',
  height: '80px',
  fontSize: 'h3.fontSize',
};

export const serverLogoSx = {
  backgroundColor: 'background.darker',
  fontSize: 'caption.fontSize',
  color: 'text.primary',
  borderRadius: '30%',
  width: '30px',
  height: '30px',
  textTransform: 'capitalize',
};

export const skeletonButtonSx = {
  borderRadius: (theme) => `${theme.shape.borderRadius}px`,
};
