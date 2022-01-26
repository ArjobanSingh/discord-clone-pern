// import PropTypes from 'prop-types';
import { memo } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { ChannelContainer, MainContent, membersDrawerWidth } from './styles';
import ResponsiveDrawer from '../../common/ResponsiveDrawer';

// TODO: maybe change drawers logic in future
const Channel = (props) => {
  const params = useParams();
  const {
    closeMembersDrawer,
    isMembersDrawerOpen,
  } = useOutletContext();

  const wideScreenDrawerProps = {
    variant: 'persistent',
    sx: {
      flexShrink: 0,
      display: { xs: 'none', sm: 'block' },
      width: membersDrawerWidth,
      '& .MuiDrawer-paper': {
        boxSizing: 'border-box',
        width: membersDrawerWidth,
      },
    },
  };

  return (
    <ChannelContainer>
      <MainContent isDrawerOpen={isMembersDrawerOpen}>
        Single channel messages
        {' '}
        {params.channelId}
        {' '}
        and some extra stuff and what not again testing and again and some
        random text, lets see how far it can go and again some messages and let
        see how far it can go
      </MainContent>

      <ResponsiveDrawer
        mobileOpen={isMembersDrawerOpen}
        open={isMembersDrawerOpen}
        anchor="right"
        closeDrawer={closeMembersDrawer}
        wideScreenDrawerProps={wideScreenDrawerProps}
      >
        <div style={{ marginTop: '50px' }}>
          server members
        </div>
      </ResponsiveDrawer>
    </ChannelContainer>
  );
};

Channel.propTypes = {

};

export default memo(Channel);
