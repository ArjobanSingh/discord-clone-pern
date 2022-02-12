import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import {
  LineSelect, MembersInfoBar, SearchInput, SelectOption,
} from './styles';
import useServerData from '../../../customHooks/useServerData';
import { ServerMemberRoles } from '../../../constants/servers';
import { stopPropagation } from '../../../utils/helperFunctions';
import { FlexDiv } from '../../../common/StyledComponents';

const EVERYONE = '@everyone';

const ServerMembers = (props) => {
  const { serverId } = useParams();
  const { serverDetails } = useServerData(serverId, false);
  const { members } = serverDetails;

  const [filtererdRole, setFilteredRole] = useState(EVERYONE);
  const [searchInput, setSearchInput] = useState('');

  const handleFilterChange = (e) => {
    setFilteredRole(e.target.value);
  };

  const onSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // TODO: we could debounce in future if face performamce issues
  const membersToRender = useMemo(() => members.filter((member) => (
    member.userName.toLowerCase().includes(searchInput.toLowerCase())
    && (filtererdRole === EVERYONE || member.role === filtererdRole)
  )), [members, searchInput, filtererdRole]);

  console.log({ membersToRender });
  return (
    <>
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

        <FlexDiv injectCss="justify-content: flex-start">
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
            onChange={onSearchChange} // to prevent weired error of losing focus on typing s
            onKeyDown={stopPropagation}
          />
        </FlexDiv>
      </MembersInfoBar>
      <div>
        {membersToRender.map((member) => (
          <div key={member.userId}>{member.userName}</div>
        ))}
      </div>
    </>
  );
};

ServerMembers.propTypes = {

};

export default ServerMembers;
