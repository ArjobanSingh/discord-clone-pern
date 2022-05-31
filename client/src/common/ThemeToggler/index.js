import { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  IconSpan,
  InputCheckbox,
  InputWrapper,
  MoonIconWrapper,
  SunIconWrapper,
  ToggleBall,
  Wrapper,
} from './styles';
import { ColorModeContext } from '../../providers/CustomThemeProvider';
import { DARK_THEME, LIGHT_THEME } from '../../constants/theme';
import StyledTooltip from '../StyledToolTip';

const ThemeToggler = () => {
  const { toggleColorMode, mode } = useContext(ColorModeContext);

  const handleThemeChange = () => {
    toggleColorMode();
  };

  return (
    <StyledTooltip
      placement="top"
      title="Toggle theme"
    >
      <Wrapper>
        <InputWrapper role="button" tabIndex="-1" onClick={handleThemeChange}>
          <MoonIconWrapper isVisible={mode === DARK_THEME}>
            <IconSpan>🌜</IconSpan>
          </MoonIconWrapper>
          <SunIconWrapper isVisible={mode === LIGHT_THEME}>
            <IconSpan>🌞</IconSpan>
          </SunIconWrapper>
          <ToggleBall isDarkMode={mode === DARK_THEME} />
        </InputWrapper>
        <InputCheckbox
          onChange={handleThemeChange}
          checked={mode === DARK_THEME}
          type="checkbox"
          aria-label="Switch between dark and light mode"
        />
      </Wrapper>
    </StyledTooltip>
  );
};

ThemeToggler.propTypes = {

};

export default ThemeToggler;
