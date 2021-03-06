// import PropTypes from 'prop-types';
import { useOutletContext } from 'react-router-dom';
import ServerHeader from '../ServerHeader';

const MeServer = (props) => {
  const {
    openDrawer: openServerListDrawer,
  } = useOutletContext();

  return (
    <>
      <ServerHeader
        name="ME"
        openServerListDrawer={openServerListDrawer}
      />
    </>
  );
};

MeServer.propTypes = {

};

export default MeServer;
