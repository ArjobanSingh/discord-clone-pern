// import PropTypes from 'prop-types';
import { memo } from 'react';
import { useParams } from 'react-router-dom';

const Channel = (props) => {
  const params = useParams();
  // console.log('channel id', props);
  return (
    <div>
      Single channel messages
    </div>
  );
};

Channel.propTypes = {

};

export default memo(Channel);
