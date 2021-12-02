import {
  lazy, Suspense, useContext,
} from 'react';
import './App.css';
import { styled } from '@mui/material/styles';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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

const InnerWrapper = styled('div')`
  height: 100%;
  overflow: auto;
`;

const Child = () => {
  const { toggleColorMode } = useContext(ColorModeContext);
  const dispatch = useDispatch();

  return (
    <>
      <Button
        sx={{
          position: 'fixed', top: '10', left: '10px', zIndex: '20',
        }}
        color="primary"
        variant="contained"
        onClick={toggleColorMode}
      >
        toggle theme
      </Button>

      <Button
        sx={{
          position: 'fixed', top: '10', left: '210px', zIndex: '20',
        }}
        color="primary"
        variant="contained"
        onClick={() => dispatch({ type: 'AUTH_SIGN_IN_REQUESTED' })}
      >
        login test
      </Button>

      <Button
        sx={{
          position: 'fixed', top: '10', left: '410px', zIndex: '20',
        }}
        color="primary"
        variant="contained"
        onClick={() => dispatch({ type: 'AUTH_SIGN_OUT_SUCCESS' })}

      >
        logout test
      </Button>

      <Button
        sx={{
          position: 'fixed', top: '10', left: '610px', zIndex: '20',
        }}
        color="primary"
        variant="contained"
        onClick={() => dispatch({ type: 'TEST_ACTION' })}
      >
        timeout saga
      </Button>
    </>
  );
};

function App() {
  return (
    <CustomThemeProvider>
      <Container>
        <Child />
        <InnerWrapper>
          <Suspense fallback={<div>Loader...</div>}>
            <Routes>
              <Route
                path="/login"
                element={<Auth />}
              />
              <Route path="/" element={<Navigate replace to="/login" />} />
            </Routes>
          </Suspense>
        </InnerWrapper>
      </Container>
    </CustomThemeProvider>
  );
}

export default App;
