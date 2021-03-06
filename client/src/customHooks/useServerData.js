import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addExploreServerData, resetExploreServerData, serverDetailsRequested } from '../redux/actions/servers';
import { getExploreServerData, getServerDetails } from '../redux/reducers';

const useServerData = (serverId, makeApiRequest = false) => {
  const userServerDetails = useSelector((state) => getServerDetails(state, serverId));
  const exploreServerDetails = useSelector((state) => getExploreServerData(state, serverId));
  const dispatch = useDispatch();

  const serverDetails = userServerDetails || exploreServerDetails;
  const isExploringServer = !!exploreServerDetails;
  const isExploringServerRef = useRef(isExploringServer);

  useEffect(() => {
    isExploringServerRef.current = isExploringServer;
  }, [isExploringServer]);

  const fetchServerData = () => {
    dispatch(serverDetailsRequested(serverDetails.id, isExploringServer));
  };

  useEffect(() => {
    if (!serverId || !makeApiRequest) return;

    if (serverDetails) {
      if (!serverDetails.members && !serverDetails.isFetchingData && !serverDetails.error) {
        // fetch only if not full server data and also not fetching or failed already
        fetchServerData();
      }
      return;
    }

    // userServer and exploreServer details are undefined, user directly navigated to current route
    // we will see this as public server url, and will wait till api resolved
    dispatch(addExploreServerData({ id: serverId, name: '' }));
  }, [serverDetails, makeApiRequest]);

  useEffect(() => () => {
    if (isExploringServerRef.current) {
      // if user was exploring some public server, and changed route
      // remove that server data from explore server state
      dispatch(resetExploreServerData(serverId));
    }
  }, [serverId]);

  return {
    serverDetails: serverDetails || { isFetchingData: true, name: '', id: serverId },
    isExploringServer,
    noServerFound: serverDetails?.error?.status === 404,
    retryServerData: fetchServerData,
  };
};

export default useServerData;
