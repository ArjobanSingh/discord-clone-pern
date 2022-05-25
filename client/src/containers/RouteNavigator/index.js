import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAllServers } from '../../redux/reducers';
import { isEmpty } from '../../utils/validators';
import useUser from '../../customHooks/useUser';
import ServersFallback from '../Routes/ServersFallback';

const RouteNavigator = () => {
  const { isLoading, user } = useUser();
  const userJoinedServers = useSelector(getAllServers);

  if (isLoading || !user) return <ServersFallback />;
  if (isEmpty(userJoinedServers)) return <Navigate replace to="/guild-discovery" />;

  const [firstServer] = Object.keys(userJoinedServers);
  return <Navigate replace to={`/channels/${firstServer}`} />;
};

RouteNavigator.propTypes = {

};

export default RouteNavigator;
