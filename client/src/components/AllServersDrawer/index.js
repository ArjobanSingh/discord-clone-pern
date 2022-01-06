import PropTypes from 'prop-types';
import { useState } from 'react';
import TouchRipple from '@mui/material/ButtonBase/TouchRipple';
import useUser from '../../customHooks/userUser';
import { getCharacterName } from '../../utils/helperFunctions';
import {
  AvatarWrapper,
  Bar, barStyleCss, ServerIconList, SidebarContainer, StyledAvatar, VerticalBar,
} from './styles';
import Logo from '../../common/Logo';
import { FlexDiv } from '../../common/StyledComponents';

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
        <AvatarWrapper>
          <StyledAvatar
            selected={selectedServer === '@me'}
            onClick={() => { setSelectedServer('@me'); }}
          >
            <Logo />
          </StyledAvatar>
          <VerticalBar selected={selectedServer === '@me'} />
        </AvatarWrapper>

        <Bar />
        {servers.map((server) => (
          <AvatarWrapper key={server.serverId}>
            <StyledAvatar
              src={server.avatar}
              data-serverid={server.serverId}
              onClick={openThisServer}
              selected={server.serverId === selectedServer}
            >
              {getCharacterName(server.serverName)}
            </StyledAvatar>
            <VerticalBar selected={server.serverId === selectedServer} />
          </AvatarWrapper>
        ))}
      </ServerIconList>
    </SidebarContainer>
  );
};

AllServersDrawer.propTypes = {

};

export default AllServersDrawer;
