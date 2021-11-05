import './App.css';
import { styled } from '@mui/material/styles';
import { useContext } from 'react';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import CustomThemeProvider, { ColorModeContext } from './providers/CustomThemeProvider';
// import { MAIN_BACKGROUND } from './constants/images';

const Container = styled('div')(({ theme }) => `
  background-color: ${theme.palette.background.default};
  width: 100%;
  height: 100vh;
`);

const Child = () => {
  const { toggleColorMode } = useContext(ColorModeContext);

  return <Button color="primary" variant="contained" onClick={toggleColorMode}>toggle theme</Button>;
};

function App() {
  return (
    <CustomThemeProvider>
      <Container>
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
          }}
        >
          Welcome
        </Typography>
        <Child />
      </Container>
    </CustomThemeProvider>
  );
}

export default App;
