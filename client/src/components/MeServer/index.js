// import PropTypes from 'prop-types';
import { useOutletContext } from 'react-router-dom';
import ServerHeader from '../ServerHeader';

const MeServer = (props) => {
  const openServerListDrawer = useOutletContext();

  return (
    <>
      <ServerHeader
        serverName="ME"
        openServerListDrawer={openServerListDrawer}
      />
    </>
  );
};

MeServer.propTypes = {

};

export default MeServer;
