import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import {
  AbsoluteProgress,
  ConfirmationButton,
  DarkMenu,
  LineSelect,
  MemberSettingsMenuItem,
  MembersInfoBar,
  RoleMenuItem,
  SearchInput,
  SelectOption,
} from './styles';
import useServerData from '../../../customHooks/useServerData';
import { ServerMemberRoles, ServerMemberScores } from '../../../constants/servers';
import { stopPropagation } from '../../../utils/helperFunctions';
import useUser from '../../../customHooks/useUser';
import SingleMember from './SingleMember';
import { kickServerMemberRequested, updateOwnershipRequested, updateServerRoleRequested } from '../../../redux/actions/servers';
import ConfirmationModal from '../../../common/ConfirmationModal';
import { getUpdateServerData } from '../../../redux/reducers';
import useDidUpdate from '../../../customHooks/useDidUpdate';

const EVERYONE = '@everyone';

const KICK_USER = 'KICK_USER';
const TRANSFER_OWNERSHIP = 'TRANSFER_OWNERSHIP';

const getModalData = (memberSettingsMenuData, modalType) => {
  const { userName } = memberSettingsMenuData;
  switch (modalType) {
    case KICK_USER: {
      return {
        title: `Kick ${userName} from server`,
        description: `Are your sure you want to kick ${userName} from the server.
        They will be able to rejoin again with the new Invite`,
        confirmTitle: 'Kick',
      };
    }
    case TRANSFER_OWNERSHIP:
      return {
        title: 'Transfer Ownership',
        description: `Are you sure you want to transfer ownership of this server to ${userName}.
         It will officially belong to them`,
        confirmTitle: 'Transfer Ownership',
      };
    default:
      return { title: '', description: '' };
  }
};

const ServerMembers = (props) => {
  const { serverId } = useParams();
  const { serverDetails } = useServerData(serverId, false);

  const { isLoading, error } = useSelector(
    (state) => getUpdateServerData(state, serverId),
  ) || { isLoading: false, error: null };

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

  const [memberSettingsMenuData, setMembersSettingsMenuData] = useState({
    anchorEl: null,
    userId: null,
    userName: null,
  });

  const [confirmationModalData, setConfirmationModalData] = useState(null);

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

  const closeSettingsMenu = () => {
    setMembersSettingsMenuData({
      anchorEl: null,
      userId: null,
      userName: null,
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModalData(null);
  };

  useDidUpdate(() => {
    if (!isLoading && !error) {
      closeConfirmationModal();
      closeSettingsMenu();
    }
  }, [isLoading, error]);

  const updateRole = (e) => {
    const { role: newRole } = e.target.closest('li').dataset;
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

  const settingMenuOptions = [
    { title: `Kick ${memberSettingsMenuData.userName}`, type: KICK_USER, minRole: ServerMemberRoles.MODERATOR },
    { title: 'Transfer Ownership', type: TRANSFER_OWNERSHIP, minRole: ServerMemberRoles.OWNER },
  ];

  const handleSettingClick = (e) => {
    const { type: optionType } = e.target.closest('li').dataset;
    setConfirmationModalData(optionType);
  };

  const {
    title: modalTitle,
    description: modalDescription,
    confirmTitle,
  } = getModalData(memberSettingsMenuData, confirmationModalData);

  const onConfirm = () => {
    const optionType = confirmationModalData;
    switch (optionType) {
      case TRANSFER_OWNERSHIP:
        dispatch(updateOwnershipRequested(serverId, memberSettingsMenuData.userId));
        break;
      case KICK_USER:
        dispatch(kickServerMemberRequested(serverId, memberSettingsMenuData.userId));
        break;
      default:
        // nothing
    }
  };

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
              setMembersSettingsMenuData={setMembersSettingsMenuData}
            />
          ))}
        </div>
      </div>

      <DarkMenu
        id="member-settings-menu"
        anchorEl={memberSettingsMenuData.anchorEl}
        open={!!memberSettingsMenuData.anchorEl}
        onClose={closeSettingsMenu}
      >
        {settingMenuOptions.map((option) => {
          const { minRole, title, type } = option;
          if (ServerMemberScores[minRole] > ServerMemberScores[loggedInMember.role]) return null;

          return (
            <MemberSettingsMenuItem key={title} data-type={type} onClick={handleSettingClick}>
              {option.title}
            </MemberSettingsMenuItem>
          );
        })}
      </DarkMenu>
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
            <RoleMenuItem key={role} data-role={role} onClick={updateRole}>
              {role}
            </RoleMenuItem>
          );
        })}
      </Menu>
      <ConfirmationModal
        open={!!confirmationModalData}
        onClose={closeConfirmationModal}
        title={modalTitle}
        description={modalDescription}
        onConfirm={onConfirm}
        confirmButton={(
          <ConfirmationButton
            variant="contained"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            <span className="button-text">
              {confirmTitle}
            </span>
            {isLoading && <AbsoluteProgress color="inherit" size={20} />}
          </ConfirmationButton>
        )}
      />
    </>
  );
};

ServerMembers.propTypes = {

};

export default ServerMembers;
