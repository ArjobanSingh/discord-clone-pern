import styled from 'styled-components';
import PropTypes from 'prop-types';

export const FlexDiv = styled.div(({ theme, injectCss }) => `
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  ${typeof injectCss === 'function' ? injectCss(theme) : injectCss}
`);

export const Header = styled.header`
  width: 100%;
  padding: 0 16px;
  height: 50px;
  box-shadow: 0 1px 0 rgba(4,4,5,0.2),
              0 1.5px 0 rgba(6,6,7,0.05),
              0 2px 0 rgba(4,4,5,0.05);
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.background.default};
  z-index: ${({ theme }) => theme.zIndex.drawer + 1};
  position: relative;
`;

export const EllipsisDiv = styled.div`
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ linesCount }) => linesCount || '2'};

  ${({ injectCss, theme }) => (typeof injectCss === 'function'
    ? injectCss(theme) : injectCss)}
`;

export const SimpleEllipsis = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ injectCss, theme }) => (typeof injectCss === 'function'
    ? injectCss(theme) : injectCss)}
`;

export const ScreenWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const WidthWrapper = styled.div(({ theme }) => `
  width: 100%;
  height: 100%;
  padding: ${theme.spacing(5)};
  max-width: 93.75rem;
`);

export const MaxWidthWrapper = ({ children }) => (
  <ScreenWrapper>
    <WidthWrapper>
      {children}
    </WidthWrapper>
  </ScreenWrapper>
);

MaxWidthWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
