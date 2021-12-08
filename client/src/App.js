import {
  lazy, Suspense, useContext,
} from 'react';
import './App.css';
import { styled } from '@mui/material/styles';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import CustomThemeProvider, { ColorModeContext } from './providers/CustomThemeProvider';
import Auth from './components/Auth';
import RequireAuth from './containers/RequireAuth';
import Channels from './components/Channels';
import { logoutRequested } from './redux/actions/auth';
import useIsAuthenticated from './customHooks/useIsAuthenticated';

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
  const isAuthenticated = useIsAuthenticated();
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

      {isAuthenticated && (
        <Button
          sx={{
            position: 'fixed', top: '10', left: '210px', zIndex: '20',
          }}
          color="primary"
          variant="contained"
          onClick={() => { dispatch(logoutRequested()); }}
        >
          Logout
        </Button>
      )}
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
              <Route
                path="/"
                element={(
                  <RequireAuth>
                    <Channels />
                  </RequireAuth>
                )}
              />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
          </Suspense>
        </InnerWrapper>
      </Container>
    </CustomThemeProvider>
  );
}

export default App;