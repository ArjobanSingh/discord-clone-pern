import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import ResponsiveDrawer from '../../common/ResponsiveDrawer';
import useUser from '../../customHooks/userUser';
import { userRequested } from '../../redux/actions/user';

const Servers = (props) => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useUser();

  useEffect(() => {
    if (!user) dispatch(userRequested());
  }, []);

  if (isLoading) return <div>Loading...</div>;

  if (error) return error.message;

  return (
    <Box
      display="flex"
      width="100%"
      height="100%"
    >
      <ResponsiveDrawer>
        some drawer content
      </ResponsiveDrawer>
      <span><Outlet /></span>
    </Box>
  );
};

Servers.propTypes = {

};

export default Servers;
