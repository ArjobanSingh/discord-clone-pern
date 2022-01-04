import PropTypes from 'prop-types';
import { Outlet, useParams } from 'react-router-dom';

const Server = (props) => {
  const params = useParams();
  console.log('server id', params.serverId);
  return (
    <div>
      Single Server
      <Outlet />
    </div>
  );
};

Server.propTypes = {

};

export default Server;
