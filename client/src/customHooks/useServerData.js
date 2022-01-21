import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { exploreServerDataRequested, serverDetailsRequested } from '../redux/actions/servers';
import { getExploreServerData, getServerDetails } from '../redux/reducers';

const emptyServerData = { isFetchingData: true };

const useServerData = (serverId) => {
  const serverDetails = useSelector((state) => getServerDetails(state, serverId));
  const exploreServerDetails = useSelector((state) => getExploreServerData(state, serverId));
  const dispatch = useDispatch();

  const validServerDetails = serverDetails || exploreServerDetails;
  const isExploringServer = !!exploreServerDetails;

  useEffect(() => {
    if (validServerDetails) {
    // either server user is part of or exploring some new server
      if (!validServerDetails.members && !validServerDetails.isFetchingData) {
        // if members not present or not yet fetching server details, fetch server details
        dispatch(serverDetailsRequested(validServerDetails.id, isExploringServer));
      }
      return;
    }

    // exploreServerDetails is also undefined, user directly navigated to current route
    // we will see this as public server url, and will wait till api resolved
    dispatch(exploreServerDataRequested({ id: serverId, name: '' }));
  }, [validServerDetails]);

  return {
    validServerDetails: validServerDetails || emptyServerData,
    isExploringServer,
    noServerFound: validServerDetails.error?.errStatus === 404,
  };
};

export default useServerData;
