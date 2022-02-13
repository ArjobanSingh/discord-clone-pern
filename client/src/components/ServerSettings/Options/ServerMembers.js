import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import {
  LineSelect,
  MembersInfoBar,
  SearchInput,
  SelectOption,
} from './styles';
import useServerData from '../../../customHooks/useServerData';
import { ServerMemberRoles, ServerMemberScores } from '../../../constants/servers';
import { stopPropagation } from '../../../utils/helperFunctions';
import useUser from '../../../customHooks/useUser';
import SingleMember from './SingleMember';
import { updateServerRoleRequested } from '../../../redux/actions/servers';

const EVERYONE = '@everyone';

const ServerMembers = (props) => {
  const { serverId } = useParams();
  const { serverDetails } = useServerData(serverId, false);
  const { user } = useUser();
  const dispatch = useDispatch();

  const { members } = serverDetails;

  const [filtererdRole, setFilteredRole] = useState(EVERYONE);
  const [searchInput, setSearchInput] = useState('');
  const [updateRoleMenuData, setUpdateRoleMenuData] = useState({
    anchorEl: null,
    userId: null,
    currentUserRole: null,
  });

  const handleFilterChange = (e) => {
    setFilteredRole(e.target.value);
  };

  const onSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const closeRoleMenu = () => {
    setUpdateRoleMenuData({
      anchorEl: null,
      userId: null,
      currentUserRole: null,
    });
  };

  const updateRole = (newRole) => {
    console.log({ newRole, userId: updateRoleMenuData.userId });
    if (newRole === updateRoleMenuData.currentUserRole) {
      closeRoleMenu();
      return;
    }

    dispatch(updateServerRoleRequested({
      role: newRole,
      userId: updateRoleMenuData.userId,
      serverId,
    }));
    closeRoleMenu();
  };

  const loggedInMember = useMemo(() => (
    members.find((member) => member.userId === user.id)
  ), [members, user.id]);

  // TODO: we could debounce in future if face performamce issues
  const membersToRender = useMemo(() => members.filter((member) => (
    member.userName.toLowerCase().includes(searchInput.toLowerCase())
    && (filtererdRole === EVERYONE || member.role === filtererdRole)
  )), [members, searchInput, filtererdRole]);

  return (
    <>
      <div>
        <MembersInfoBar>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            marginRight="auto"
          >
            {members.length}
            {' '}
            {members.length > 1 ? 'Members' : 'Member'}
          </Typography>

          <LineSelect
            id="filtered-role"
            value={filtererdRole}
            onChange={handleFilterChange}
            variant="standard"
          >
            <SelectOption value={EVERYONE}>
              everyone
            </SelectOption>
            {Object.keys(ServerMemberRoles).map((key) => (
              <SelectOption key={key} value={key}>{key.toLowerCase()}</SelectOption>
            ))}
          </LineSelect>

          <SearchInput
            type="search"
            placeholder="search"
            value={searchInput}
            onChange={onSearchChange}
            onKeyDown={stopPropagation}
          />
        </MembersInfoBar>
        <div>
          {membersToRender.map((member) => (
            <SingleMember
              key={member.userId}
              loggedInMember={loggedInMember}
              currentMember={member}
              setUpdateRoleMenuData={setUpdateRoleMenuData}
            />
          ))}
        </div>
      </div>

      <Menu
        id="update-role-menu"
        anchorEl={updateRoleMenuData.anchorEl}
        open={!!updateRoleMenuData.anchorEl}
        onClose={closeRoleMenu}
      >
        {Object.values(ServerMemberRoles).map((role) => {
          if (ServerMemberScores[role] > ServerMemberScores[loggedInMember.role]
              || role === ServerMemberRoles.OWNER
          ) return null;
          return (
            <MenuItem
              key={role}
              onClick={() => updateRole(role)}
              sx={{
                backgroundColor: updateRoleMenuData.currentUserRole === role
                  ? 'background.darker' : 'transparent',
                ':hover': {
                  backgroundColor: 'background.darker',
                },
              }}
            >
              {role}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

ServerMembers.propTypes = {

};

export default ServerMembers;
