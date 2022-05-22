import {
  useContext,
} from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import CustomThemeProvider, { ColorModeContext } from './providers/CustomThemeProvider';
import { logoutRequested } from './redux/actions/auth';
import useIsAuthenticated from './customHooks/useIsAuthenticated';
import AppRoutes from './containers/Routes';
import BaseStyles from './BaseStyles';
import GlobalNavigation from './components/GlobalNavigation';
import SocketHandler from './containers/SocketHandler';

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
      {/* <Button
        sx={{
          position: 'fixed', bottom: '100px', left: '10px', zIndex: '2000',
        }}
        color="primary"
        variant="contained"
        onClick={toggleColorMode}
      >
        toggle theme
      </Button> */}

      {isAuthenticated && (
        <Button
          sx={{
            position: 'fixed', bottom: '100px', left: '210px', zIndex: '2000',
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
      <SocketHandler />
      <BaseStyles />
      <GlobalNavigation />
      <ToastContainer theme="dark" />
      <Container>
        <Child />
        <InnerWrapper>
          <AppRoutes />
        </InnerWrapper>
      </Container>
    </CustomThemeProvider>
  );
}

export default App;
