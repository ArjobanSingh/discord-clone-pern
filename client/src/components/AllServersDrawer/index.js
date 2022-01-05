import PropTypes from 'prop-types';
import { useState } from 'react';
import useUser from '../../customHooks/userUser';
import { getCharacterName } from '../../utils/helperFunctions';
import { ServerIconList, SidebarContainer, StyledAvatar } from './styles';

const AllServersDrawer = (props) => {
  const { user: { servers } } = useUser();

  // TODO: get initial serverId
  const [selectedServer, setSelectedServer] = useState('');

  const openThisServer = (e) => {
    const { serverid: serverId } = e.target.dataset;
    // TODO: navigate to this url
    setSelectedServer(serverId);
  };

  return (
    <SidebarContainer>
      <ServerIconList>
        {servers.map((server) => (
          <StyledAvatar
            key={server.serverId}
            src={server.avatar}
            data-serverid={server.serverId}
            onClick={openThisServer}
            selected={server.serverId === selectedServer}
          >
            {getCharacterName(server.serverName)}
          </StyledAvatar>
        ))}
      </ServerIconList>
    </SidebarContainer>
  );
};

AllServersDrawer.propTypes = {

};

export default AllServersDrawer;
