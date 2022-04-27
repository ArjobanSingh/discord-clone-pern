import styled from 'styled-components';

export const MediaMessageContainer = styled.div(({ theme }) => `
  padding-block: ${theme.spacing(0.5)};
`);

export const MediaContainer = styled.div(({ theme, width, height }) => `
  position: relative;
  width: ${width}px;
  height: ${height}px;
  border-radius: ${theme.shape.borderRadius}px;
`);
