import PropTypes from 'prop-types';
import ChatLoader from '../Chat/ChatLoader';
import ServerHeader from '../ServerHeader';
import { InnerServerContainer, MainServerContent } from './styles';

const ServerLoader = ({ openServerListDrawer }) => (
  <InnerServerContainer>
    <ServerHeader
      name=""
      openServerListDrawer={openServerListDrawer}
      openMembersDrawer={undefined}
    />
    <MainServerContent>
      <ChatLoader />
    </MainServerContent>
  </InnerServerContainer>
);

ServerLoader.propTypes = {
  openServerListDrawer: PropTypes.func,
};

ServerLoader.defaultProps = {
  openServerListDrawer: () => {},
};

export default ServerLoader;
