import styled from 'styled-components';

export default styled.img(({
  height = '', width = '', position = '', objectFit = '', borderRadius = '',
}) => `
  height: ${height};
  width: ${width};
  position: ${position};
  object-fit: ${objectFit};
  border-radius: ${borderRadius};
`);
