import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExploreServerData, resetExploreServerData, serverDetailsRequested } from '../redux/actions/servers';
import { getExploreServerData, getServerDetails } from '../redux/reducers';

const useServerData = (serverId, makeApiRequest = false) => {
  const userServerDetails = useSelector((state) => getServerDetails(state, serverId));
  const exploreServerDetails = useSelector((state) => getExploreServerData(state, serverId));
  const dispatch = useDispatch();

  const serverDetails = userServerDetails || exploreServerDetails;
  const isExploringServer = !!exploreServerDetails;

  useEffect(() => {
    if (!serverId || !makeApiRequest) return;

    if (serverDetails) {
      if (!serverDetails.members && !serverDetails.isFetchingData && !serverDetails.error) {
        // fetch only if not full server data and also not fetching or failed already
        dispatch(serverDetailsRequested(serverDetails.id, isExploringServer));
      }
      return;
    }

    // userServer and exploreServer details are undefined, user directly navigated to current route
    // we will see this as public server url, and will wait till api resolved
    dispatch(addExploreServerData({ id: serverId, name: '' }));
  }, [serverDetails, makeApiRequest]);

  useEffect(() => () => {
    if (isExploringServer) {
      // if user was exploring some public server, and changed route
      // remove that server data from explore server state
      dispatch(resetExploreServerData());
    }
  }, [serverId, isExploringServer]);

  return {
    serverDetails: serverDetails || { isFetchingData: true, name: '', id: serverId },
    isExploringServer,
    noServerFound: serverDetails?.error?.errStatus === 404,
  };
};

export default useServerData;
