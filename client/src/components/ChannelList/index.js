// import PropTypes from 'prop-types';

import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ChannelList = (props) => {
  const params = useParams();
  const currentServer = useSelector((state) => state.servers[params.serverId]) || {};

  console.log('Channel List params', currentServer);
  return (
    <div>
      Name:
      {' '}
      {currentServer.name}
      ServerId:
      {' '}
      {currentServer.id}
    </div>
  );
};

ChannelList.propTypes = {

};

export default ChannelList;
