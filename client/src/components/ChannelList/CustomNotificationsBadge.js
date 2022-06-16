import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getChannelNotifications } from '../../redux/reducers';

const BadgeContainer = styled.div(({ theme }) => `
  height: 20px;
  min-width: 20px;
  background-color: ${theme.palette.secondary.main};
  color: ${theme.palette.common.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${theme.typography.caption.fontSize};
  border-radius: 50%;
`);

const CustomNotificationsBadge = (props) => {
  const { serverId, channelId } = props;

  const channelNotifications = useSelector(
    (state) => getChannelNotifications(state, serverId, channelId),
  ) || { count: 0 };

  const { count } = channelNotifications;

  if (!count) return null;

  return (
    <BadgeContainer>
      {count > 999 ? '999+' : count}
    </BadgeContainer>
  );
};

CustomNotificationsBadge.propTypes = {
  serverId: PropTypes.string.isRequired,
  channelId: PropTypes.string.isRequired,
};

export default CustomNotificationsBadge;
