import styled from 'styled-components';

export const ImageContainer = styled.div`
  padding-block: ${({ theme }) => theme.spacing(0.5)};
`;

export const StyledImage = styled.img`
    display: block;
    max-width: 400px;
    max-height: 350px;
    /* min-height: 225px; */
    width: auto;
    height: auto;
`;
