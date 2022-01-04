import PropTypes from 'prop-types';
import useUser from '../../customHooks/userUser';
import { ServerIconList, SidebarContainer } from './styles';

const AllServersDrawer = (props) => {
  const { user: { servers } } = useUser();

  console.log('servers', servers);
  return (
    <SidebarContainer>
      <ServerIconList>some list</ServerIconList>
    </SidebarContainer>
  );
};

AllServersDrawer.propTypes = {

};

export default AllServersDrawer;
