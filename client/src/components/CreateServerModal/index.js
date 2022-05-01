import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import {
  ContentWrapper,
  CreateServerButton,
  FileInput,
  Form,
  IconWrapper,
  ModalContainer,
  ModalFooter,
  SwitchLabel,
  Upload,
} from './styles';
import { FlexDiv } from '../../common/StyledComponents';
import { UPLOAD_FILE } from '../../constants/images';
import StyledTextfield from '../../common/StyledTextfield';
import { createServerRequested } from '../../redux/actions/servers';
import { ServerTypes, serverValidation } from '../../constants/servers';
import { isEmpty } from '../../utils/validators';
import { getServerCreationData } from '../../redux/reducers';
import useDidUpdate from '../../customHooks/useDidUpdate';
import Error from '../../common/Error';
import { MAX_FILE_SIZE } from '../../constants/Message';
import StyledImage from '../../common/StyledImage';

const CreateServerModal = (props) => {
  const { closeModal } = props;
  const dispatch = useDispatch();
  const { error: apiErrors, isLoading: isCreatingServer } = useSelector(getServerCreationData);

  const [errors, setErrors] = useState({});
  const [newServerAvatar, setNewServerAvatar] = useState(null);

  useDidUpdate(() => {
    if (!isEmpty(apiErrors)) setErrors(apiErrors);
  }, [apiErrors]);

  const handleImageUpload = (e) => {
    const [currentFile] = e.target.files || e.nativeEvent?.target?.files;
    if (!currentFile) {
      toast.error('Some error occurred, Please try again');
      return;
    }

    const { size, type } = currentFile;

    if (!type.match('image.*')) {
      toast.error('Only Image files are supported');
      return;
    }

    if (size > MAX_FILE_SIZE) {
      toast.error('Max file size is 3mb');
      return;
    }

    setNewServerAvatar({
      fileUrl: URL.createObjectURL(currentFile),
      originalFile: currentFile,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCreatingServer) return;
    const formData = new FormData(e.currentTarget);
    const name = formData.get('server-name');
    const description = formData.get('server-description');
    const isServerPublic = formData.get('server-type');

    const newErrorObj = {};
    if (!name?.trim()) {
      newErrorObj.name = 'Cannot be empty';
    } else if (name.length < serverValidation.SERVER_NAME_MIN_LENGTH) {
      newErrorObj.name = `Must be longer than or equal to ${serverValidation.SERVER_NAME_MIN_LENGTH} characters`;
    } else if (name.length > serverValidation.SERVER_NAME_MAX_LENGTH) {
      newErrorObj.name = `Must be smaller than or equal to ${serverValidation.SERVER_NAME_MAX_LENGTH} characters`;
    }

    if (description && description.length > serverValidation.SERVER_DESCRIPTION_MAX_LENGTH) {
      newErrorObj.description = `Must be smaller than or equal to ${serverValidation.SERVER_DESCRIPTION_MAX_LENGTH} characters`;
    }

    if (!isEmpty(newErrorObj)) {
      setErrors(newErrorObj);
      return;
    }

    setErrors({});
    const payload = {
      name,
      description,
      type: isServerPublic ? ServerTypes.PUBLIC : ServerTypes.PRIVATE,
      file: newServerAvatar,
    };
    dispatch(createServerRequested(payload, Date.now()));
  };

  const inputs = [{
    id: 'server-name-input',
    errorKey: 'name',
    name: 'server-name',
    label: 'Server name',
    autoFocus: true,
    minLength: serverValidation.SERVER_NAME_MIN_LENGTH,
    maxLength: serverValidation.SERVER_NAME_MAX_LENGTH,
    injectCss: 'margin-top: 5px;',
  }, {
    id: 'server-description-input',
    errorKey: 'description',
    name: 'server-description',
    label: 'Server description',
    maxLength: serverValidation.SERVER_DESCRIPTION_MAX_LENGTH,
    as: 'textarea',
    rows: 4,
    injectCss: 'margin-top: 5px; textarea { resize: none; }',
  }];

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
            <StyledImage
              src={newServerAvatar?.fileUrl ?? UPLOAD_FILE}
              alt="upload server avatar"
              width="80px"
              height="80px"
              borderRadius={newServerAvatar?.fileUrl ? '50%' : ''}
              objectFit="cover"
            />
            <FileInput multiple={false} type="file" accept="image/*" onChange={handleImageUpload} />
          </Upload>
        </FlexDiv>

        <Form onSubmit={handleSubmit} id="create-server-form">
          {inputs.map(({
            errorKey, id, label, ...rest
          }) => (
            <div key={id}>
              <StyledTextfield
                id={id}
                label={(
                  <Typography
                    variant="subtitle2"
                    lineHeight="normal"
                    color={errors[errorKey] ? 'error.light' : 'text.secondaryDark'}
                    fontWeight="fontWeightBold"
                    component="span"
                  >
                    {label}
                  </Typography>
                )}
                isError={!!errors[errorKey]}
                errorMessage={errors[errorKey]}
                {...rest}
              />
            </div>
          ))}

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
        {!!errors.message && <Error>{errors.message}</Error>}
      </ContentWrapper>
      <ModalFooter>
        <CreateServerButton
          form="create-server-form"
          type="submit"
          variant="contained"
        >
          {isCreatingServer
            ? <CircularProgress color="inherit" size={20} />
            : 'Create'}
        </CreateServerButton>
      </ModalFooter>
    </ModalContainer>
  );
};

CreateServerModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default CreateServerModal;
