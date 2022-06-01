import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import LogoutIcon from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { OptionsList, OptionWrapper } from '../ServerSettings/styles';
import { USER_SETTINGS } from '../../constants/user';

const ActionTypes = {
  NEW_SCREEN: 'NEW_SCREEN',
  DIRECT_ACTION: 'DIRECT_ACTION',
};

// easy to extend this data structure for more settings
// in future
const settings = {
  userSettings: {
    title: 'USER SETTINGS',
    children: [{
      title: USER_SETTINGS.MY_ACCOUNT,
      actionType: ActionTypes.NEW_SCREEN,
      suffixIcon: null,
    }],
  },
  generalSettings: {
    title: null,
    children: [{
      title: USER_SETTINGS.LOGOUT,
      actionType: ActionTypes.DIRECT_ACTION,
      suffixIcon: <LogoutIcon fontSize="small" />,
    }],
  },
};

const UserSettingsOptions = (props) => {
  const { openNewOption, openedTab } = props;

  const handleOptionClick = (e) => {
    const { item, actiontype: actionType } = e.target.closest('li').dataset;
    openNewOption(actionType === ActionTypes.NEW_SCREEN ? item : undefined);
  };

  return (
    <>
      {Object.entries(settings).map(([settingKey, settingDetails]) => {
        const { children, title } = settingDetails;
        return (
          <Fragment key={settingKey}>
            {!!title && (
              <Typography
                variant="body2"
                component="div"
                color="text.secondaryDark"
                fontWeight="fontWeightMedium"
                paddingLeft={(theme) => theme.spacing(1)}
                marginBottom={(theme) => theme.spacing(1)}
              >
                {title}
              </Typography>
            )}
            <OptionsList>
              {children.map((child) => (
                <OptionWrapper
                  selected={openedTab === child.title}
                  key={child.title}
                  data-item={child.title}
                  data-actiontype={child.actionType}
                  onClick={handleOptionClick}
                >
                  <Typography
                    variant="body2"
                    fontWeight="fontWeightBold"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <span>{child.title}</span>
                    {child.suffixIcon}
                  </Typography>
                </OptionWrapper>
              ))}
            </OptionsList>
            <Divider
              sx={{
                borderColor: 'text.secondaryDark',
                marginBlock: (theme) => theme.spacing(1.5),
              }}
            />
          </Fragment>
        );
      })}

    </>
  );
};

UserSettingsOptions.propTypes = {
  openedTab: PropTypes.string.isRequired,
  openNewOption: PropTypes.func.isRequired,
};

export default UserSettingsOptions;
