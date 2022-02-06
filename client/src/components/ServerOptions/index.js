import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { SERVER_SETTINGS, ServerMemberRoles } from '../../constants/servers';
import { SimpleEllipsis } from '../../common/StyledComponents';
import useServerData from '../../customHooks/useServerData';
import { OptionsList, OptionWrapper } from './styles';

const { OWNER, ADMIN, MODERATOR } = ServerMemberRoles;

const options = [{
  title: SERVER_SETTINGS.OVERVIEW,
  roles: [OWNER, ADMIN],
},
{
  title: SERVER_SETTINGS.MEMBERS,
  roles: [OWNER, ADMIN, MODERATOR],
},
{
  title: SERVER_SETTINGS.BANS,
  roles: [OWNER, ADMIN, MODERATOR],
}];

const ServerOptions = (props) => {
  const { currentRole, openedTab, setOpenedTab } = props;
  const { serverId } = useParams();

  const { serverDetails: { name: serverName } } = useServerData(serverId, false);

  const handleOptionClick = (e) => {
    const { item } = e.target.closest('li').dataset;
    setOpenedTab(item);
  };

  return (
    <>
      <Typography
        variant="caption"
        component="div"
        color="text.secondaryDark"
        fontWeight="fontWeightBold"
        paddingLeft={(theme) => theme.spacing(1)}
      >
        <SimpleEllipsis>
          {serverName.toUpperCase()}
        </SimpleEllipsis>
      </Typography>
      <OptionsList>
        {options.map((option) => {
          if (!option.roles.includes(currentRole)) return null;
          return (
            <OptionWrapper
              selected={option.title === openedTab}
              key={option.title}
              data-item={option.title}
              onClick={handleOptionClick}
            >
              <Typography
                variant="body2"
                fontWeight="fontWeightBold"
              >
                {option.title}
              </Typography>
            </OptionWrapper>
          );
        })}
      </OptionsList>
    </>
  );
};

ServerOptions.propTypes = {
  currentRole: PropTypes.oneOf(Object.keys(ServerMemberRoles)).isRequired,
  openedTab: PropTypes.string.isRequired,
  setOpenedTab: PropTypes.func.isRequired,
};

export default ServerOptions;
