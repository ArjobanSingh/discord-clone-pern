import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useUser from '../../customHooks/userUser';
import { userRequested } from '../../redux/actions/user';

const Channels = (props) => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useUser();

  useEffect(() => {
    if (!user) dispatch(userRequested());
  }, []);

  if (isLoading) return <div>Loading...</div>;

  if (error) return error.message;

  return (
    <div>Channels</div>
  );
};

Channels.propTypes = {

};

export default Channels;
