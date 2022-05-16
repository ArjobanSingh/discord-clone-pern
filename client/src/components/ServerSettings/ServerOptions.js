import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useParams } from 'react-router-dom';
import { SERVER_SETTINGS, ServerMemberRoles } from '../../constants/servers';
import { SimpleEllipsis } from '../../common/StyledComponents';
import useServerData from '../../customHooks/useServerData';
import { OptionsList, OptionWrapper } from './styles';

const { OWNER, ADMIN, MODERATOR } = ServerMemberRoles;
const ActionTypes = {
  NEW_SCREEN: 'NEW_SCREEN',
  DIRECT_ACTION: 'DIRECT_ACTION',
};
const DividerType = 'Divider';

const options = [{
  title: SERVER_SETTINGS.OVERVIEW,
  roles: [OWNER, ADMIN],
  actionType: ActionTypes.NEW_SCREEN,
},
{
  title: SERVER_SETTINGS.MEMBERS,
  roles: [OWNER, ADMIN, MODERATOR],
  actionType: ActionTypes.NEW_SCREEN,
},
// {
//   title: SERVER_SETTINGS.BANS,
//   roles: [OWNER, ADMIN, MODERATOR],
//   actionType: ActionTypes.NEW_SCREEN,
// },
{
  title: DividerType,
  key: 'Divider-1',
},
{
  title: SERVER_SETTINGS.DELETE_SERVER,
  roles: [OWNER],
  actionType: ActionTypes.DIRECT_ACTION,
}];

const ServerOptions = (props) => {
  const {
    currentRole, openedTab, openNewOption,
  } = props;
  const { serverId } = useParams();

  const { serverDetails: { name: serverName } } = useServerData(serverId, false);

  const handleOptionClick = (e) => {
    const { item, actiontype: actionType } = e.target.closest('li').dataset;
    openNewOption(actionType === ActionTypes.NEW_SCREEN ? item : undefined);
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
          if (option.title === DividerType) {
            return (
              <Divider
                sx={{ backgroundColor: 'text.secondaryDark' }}
                key={option.key}
              />
            );
          }
          if (!option.roles.includes(currentRole)) return null;
          return (
            <OptionWrapper
              selected={option.title === openedTab}
              key={option.title}
              data-item={option.title}
              data-actiontype={option.actionType}
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
  openNewOption: PropTypes.func.isRequired,
};

export default ServerOptions;
