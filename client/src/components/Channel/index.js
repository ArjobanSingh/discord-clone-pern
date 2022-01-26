// import PropTypes from 'prop-types';
import { memo } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

const Channel = (props) => {
  const params = useParams();
  const {
    closeMembersDrawer,
    isMembersDrawerOpen,
  } = useOutletContext();
  console.log('channel id', {
    closeMembersDrawer,
    isMembersDrawerOpen,
  });
  return (
    <div>
      Single channel messages
    </div>
  );
};

Channel.propTypes = {

};

export default memo(Channel);
