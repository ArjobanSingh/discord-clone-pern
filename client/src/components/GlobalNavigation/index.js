// import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useDidUpdate from '../../customHooks/useDidUpdate';
import { resetNavigationState } from '../../redux/actions/navigate';
import { getNavigationState } from '../../redux/reducers';

const GlobalNavigation = () => {
  const navigateState = useSelector(getNavigationState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useDidUpdate(() => {
    if (navigateState) {
      navigate(...navigateState);
      dispatch(resetNavigationState());
    }
  }, [navigateState, navigate]);

  return null;
};

// GlobalNavigation.propTypes = {};

export default GlobalNavigation;
