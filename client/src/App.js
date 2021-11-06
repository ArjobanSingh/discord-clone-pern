import { lazy, Suspense, useContext } from 'react';
import './App.css';
import { styled } from '@mui/material/styles';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Button } from '@mui/material';
import CustomThemeProvider, { ColorModeContext } from './providers/CustomThemeProvider';
import Auth from './components/Auth';

// const Auth = lazy(() => import('./components/Auth'));

const Container = styled('div')(({ theme }) => `
  background-color: ${theme.palette.background.default};
  width: 100%;
  height: 100vh;
  overflow: hidden;
`);

const Child = () => {
  const { toggleColorMode } = useContext(ColorModeContext);

  return <Button color="primary" variant="contained" onClick={toggleColorMode}>toggle theme</Button>;
};

function App() {
  return (
    <CustomThemeProvider>
      <Container>
        {/* <Child /> */}
        <Suspense fallback={<div>Loader...</div>}>
          <Routes>
            <Route
              path="/login"
              element={<Auth />}
            />
            <Route path="/" element={<Navigate replace to="/login" />} />
          </Routes>
        </Suspense>
      </Container>
    </CustomThemeProvider>
  );
}

export default App;
