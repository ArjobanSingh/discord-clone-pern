import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getJoinServerApi } from '../../redux/reducers';
import { StyledButton } from './styles';
import StyledTooltip from '../../common/StyledToolTip';
import { SimpleEllipsis } from '../../common/StyledComponents';
import DotLoader from '../../common/DotLoader';
import { joinServerRequested } from '../../redux/actions/servers';

const JoinPublicServer = ({ server }) => {
  const { isLoading } = useSelector((state) => getJoinServerApi(state, server.id)) || {};

  const dispatch = useDispatch();

  const handleClick = () => {
    if (isLoading) return;
    dispatch(joinServerRequested(server));
  };

  return (
    <StyledButton
      variant="outlined"
      size="small"
      onClick={handleClick}
    >
      {isLoading && <DotLoader />}
      <StyledTooltip title={`Join ${server.name}`}>
        <SimpleEllipsis injectCss={isLoading ? 'opacity: 0' : ''}>
          {`Join ${server.name}`}
        </SimpleEllipsis>
      </StyledTooltip>
    </StyledButton>
  );
};

JoinPublicServer.propTypes = {
  server: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default JoinPublicServer;
