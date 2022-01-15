// import PropTypes from 'prop-types';
import {
  NavLink,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCharacterName } from '../../utils/helperFunctions';
import {
  AvatarWrapper,
  Bar,
  ServerIconList,
  SidebarContainer,
  StyledAvatar,
  VerticalBar,
} from './styles';
import Logo from '../../common/Logo';
import ChannelList from '../ChannelList';
import { getAllServers } from '../../redux/reducers';

const AllServersDrawer = () => {
  const servers = useSelector(getAllServers);

  return (
    <SidebarContainer>
      <ServerIconList>
        <NavLink to="@me">
          {({ isActive }) => (
            <AvatarWrapper>
              <StyledAvatar
                selected={isActive}
                fontSize="1.7rem"
              >
                <Logo />
              </StyledAvatar>
              <VerticalBar selected={isActive} />
            </AvatarWrapper>
          )}
        </NavLink>

        <Bar />
        {Object.values(servers).map((server) => (
          <NavLink to={server.id} key={server.id}>
            {({ isActive }) => (
              <AvatarWrapper>
                <StyledAvatar
                  src={server.avatar}
                  selected={isActive}
                >
                  {getCharacterName(server.name)}
                </StyledAvatar>
                <VerticalBar selected={isActive} />
              </AvatarWrapper>
            )}
          </NavLink>
        ))}
      </ServerIconList>
      <ChannelList />
    </SidebarContainer>
  );
};

AllServersDrawer.propTypes = {

};

export default AllServersDrawer;
