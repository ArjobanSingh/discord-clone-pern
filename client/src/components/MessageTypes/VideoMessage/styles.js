import styled from 'styled-components';

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: ${({ position }) => position};
  opacity: ${({ opacity }) => opacity};
  border-radius: inherit;
`;

export default Video;
