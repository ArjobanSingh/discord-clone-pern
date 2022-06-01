import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import CustomThemeProvider from './providers/CustomThemeProvider';
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

function App() {
  return (
    <CustomThemeProvider>
      <BaseStyles />
      <SocketHandler />
      <GlobalNavigation />
      <ToastContainer theme="dark" />

      <Container>
        <InnerWrapper>
          <AppRoutes />
        </InnerWrapper>
      </Container>
    </CustomThemeProvider>
  );
}

export default App;
