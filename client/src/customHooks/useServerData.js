import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { exploreServerDataRequested, serverDetailsRequested } from '../redux/actions/servers';
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
      if (!serverDetails.members && !serverDetails.isFetchingData) {
        // if members not present or not yet fetching server details, fetch server details
        dispatch(serverDetailsRequested(serverDetails.id, isExploringServer));
      }
      return;
    }

    // exploreServerDetails is also undefined, user directly navigated to current route
    // we will see this as public server url, and will wait till api resolved
    dispatch(exploreServerDataRequested({ id: serverId, name: '' }));
  }, [serverDetails, makeApiRequest]);

  return {
    serverDetails: serverDetails || { isFetchingData: true, name: '', id: serverId },
    isExploringServer,
    noServerFound: serverDetails?.error?.errStatus === 404,
  };
};

export default useServerData;
