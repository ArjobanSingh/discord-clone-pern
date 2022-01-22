import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  ContentWrapper,
  FileInput, Form, IconWrapper, ModalContainer, ModalFooter, SwitchLabel, Upload,
} from './styles';
import { FlexDiv } from '../../common/StyledComponents';
import { UPLOAD_FILE } from '../../constants/images';
import StyledTextfield from '../../common/StyledTextfield';
import { createServerRequested } from '../../redux/actions/servers';
import { ServerTypes, serverValidation } from '../../constants/servers';
import { isEmpty } from '../../utils/validators';

const CreateServerModal = (props) => {
  const { closeModal } = props;
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  // TODO: handle image upload
  const handleImageUpload = (e) => {
    console.log('files', e.target.files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const serverName = formData.get('server-name');
    const isServerPublic = formData.get('server-type');

    const newErrorObj = {};
    if (!serverName?.trim()) {
      newErrorObj.serverName = 'Server name cannot be empty';
    } else if (serverName.length < serverValidation.SERVER_NAME_MIN_LENGTH) {
      newErrorObj.serverName = 'Server name should be greater than 3 characters';
    } else if (serverName.length > serverValidation.SERVER_NAME_MAX_LENGTH) {
      newErrorObj.serverName = 'Server name should be less than 120 characters';
    }

    if (!isEmpty(newErrorObj)) {
      setErrors(newErrorObj);
      return;
    }

    setErrors({});
    // TODO: add description
    const payload = {
      name: serverName,
      type: isServerPublic ? ServerTypes.PUBLIC : ServerTypes.PRIVATE,
    };
    console.log({ payload });
    dispatch(createServerRequested(payload, Date.now()));
  };

  return (
    <ModalContainer>
      <ContentWrapper>
        <IconWrapper onClick={closeModal}>
          <CloseIcon />
        </IconWrapper>
        <FlexDiv injectCss="flex-direction: column; gap: 5px">
          <Typography
            id="create-server-title"
            component="h2"
            variant="h6"
            textAlign="center"
            color="text.primary"
            fontWeight="fontWeightBold"
          >
            Customize your Server
          </Typography>

          <Typography
            id="create-server-description"
            textAlign="center"
            fontWeight="normal"
            lineHeight="normal"
            color="text.secondaryDark"
            width="90%"
          >
            Give your new server a personality with a name and an icon.
            You can always change it later.
          </Typography>

          <Upload>
            <img src={UPLOAD_FILE} alt="upload server avatar" width={80} height={80} />
            <FileInput type="file" accept="image/*" onChange={handleImageUpload} />
          </Upload>
        </FlexDiv>

        <Form onSubmit={handleSubmit} id="create-server-form">
          <div>
            <StyledTextfield
              id="server-name-input"
              label={(
                <Typography
                  variant="subtitle2"
                  lineHeight="normal"
                  color={errors.serverName ? 'error.light' : 'text.secondaryDark'}
                  fontWeight="fontWeightBold"
                  component="span"
                >
                  Server name
                </Typography>
              )}
              injectCss="margin-top: 5px;"
              autoFocus
              name="server-name"
              minLength={serverValidation.SERVER_NAME_MIN_LENGTH}
              maxLength={serverValidation.SERVER_NAME_MAX_LENGTH}
              isError={!!errors.serverName}
              errorMessage={errors.serverName}
            />
          </div>
          <SwitchLabel
            name="server-type"
            control={<Switch defaultChecked size="small" />}
            label={(
              <Typography
                variant="subtitle2"
                lineHeight="normal"
                color="text.secondaryDark"
                fontWeight="fontWeightBold"
              >
                Do you want to make your server Public?
              </Typography>
            )}
            labelPlacement="start"
          />
        </Form>
      </ContentWrapper>
      <ModalFooter>
        <Button
          form="create-server-form"
          type="submit"
          variant="contained"
        >
          Create
        </Button>
      </ModalFooter>
    </ModalContainer>
  );
};

CreateServerModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default CreateServerModal;
