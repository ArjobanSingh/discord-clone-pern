import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

const Channel = (props) => {
  const params = useParams();
  console.log('channel id', params.channelId);
  return (
    <div>
      Single channel messages
    </div>
  );
};

Channel.propTypes = {

};

export default Channel;
