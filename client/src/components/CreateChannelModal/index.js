import { useState } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import {
  Container,
  Form,
  LabelContainer,
  ModalBody,
  ModalFooter,
  StyledCloseIcon,
} from './styles';
import { ChannelType } from '../../constants/channels';
import Tag from '../../common/Tag';
import StyledTextfield from '../../common/StyledTextfield';
import useIsMounted from '../../customHooks/useIsMounted';
import Error from '../../common/Error';
import { handleError } from '../../utils/helperFunctions';
import { ChannelApi } from '../../utils/apiEndpoints';
import { addChannelSuccess } from '../../redux/actions/channels';

const inputNames = {
  channelType: 'channel-type-buttons-group',
  channelName: 'channel-name',
};

const radios = [
  {
    value: ChannelType.TEXT,
    icon: <Tag fontSize="1.5rem" />,
    title: 'Text',
    description: 'Send messages, images, videos and more',
  },
  {
    value: ChannelType.AUDIO,
    icon: <VolumeUpIcon />,
    title: 'Coming Soon: Voice Channels....',
    // description: 'Hang out together with voice, video and screen share',
    description: 'You would be able to voice, video and screen share',
    disabled: true,
  },
];

const CreateChannelModal = (props) => {
  const { closeModal, serverId } = props;
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [channelType, setChannelType] = useState(ChannelType.TEXT);
  const [channelName, setChannelName] = useState('');
  const [createChannelData, setCreateChannelData] = useState({
    isCreatingChannel: false,
    error: null,
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    if (inputNames.channelType === name) setChannelType(value);
    else {
      setChannelName(value);
    }
  };

  const createChannel = async (e) => {
    e.preventDefault();
    if (!channelName?.trim()) return;
    try {
      setCreateChannelData({ isCreatingChannel: true, error: null });
      const url = ChannelApi.CREATE_CHANNEL;
      const payload = { serverId, type: channelType, name: channelName.trim() };
      const response = await axiosInstance.post(url, payload);
      dispatch(addChannelSuccess(response.data.serverId, response.data));
      if (isMounted.current) {
        navigate(`/channels/${response.data.serverId}/${response.data.id}`);
        closeModal();
      }
    } catch (err) {
      if (isMounted.current) {
        const sessionExpireError = handleError(err, (error) => {
          setCreateChannelData({
            isCreatingChannel: false,
            error: error.message || 'Something went wrong',
          });
        });
        if (sessionExpireError) dispatch(sessionExpireError);
      }
    }
  };

  const { error, isCreatingChannel } = createChannelData;

  return (
    <Container>
      <ModalBody>
        <Form id="create-channel-form" onSubmit={createChannel}>
          <Box
            display="flex"
            width="100%"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              fontWeight="fontWeightBold"
              color="text.primary"
            >
              Create Channel
            </Typography>
            <StyledCloseIcon onClick={closeModal} />
          </Box>

          <RadioGroup
            aria-labelledby="channel-type-radion-buttons-group"
            value={channelType}
            name={inputNames.channelType}
            onChange={handleChange}
            sx={{ display: 'grid', gap: '10px' }}
          >
            {radios.map((radio) => (
              <LabelContainer
                key={radio.value}
                selected={channelType === radio.value}
                labelPlacement="start"
                {...radio}
              />
            ))}
          </RadioGroup>

          <Box display="grid" gap="5px">
            <StyledTextfield
              id="create-channel-name-input"
              label={
                <Typography variant="caption" fontWeight="fontWeightBold">
                  CHANNEL NAME
                </Typography>
              }
              placeholder="new-channel"
              name={inputNames.channelName}
              value={channelName}
              onChange={handleChange}
              startIcon={
                channelType === ChannelType.TEXT ? (
                  <Tag fontSize="1.25rem" />
                ) : (
                  <VolumeUpIcon fontSize="small" />
                )
              }
            />
          </Box>
        </Form>
        {!!error && <Error>{error}</Error>}
      </ModalBody>
      <ModalFooter>
        <Button variant="info" color="text.primary" onClick={closeModal}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!channelName?.trim()}
          form="create-channel-form"
          type="submit"
          sx={{ width: '131px', height: '36px' }}
        >
          {isCreatingChannel ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            'Create Channel'
          )}
        </Button>
      </ModalFooter>
    </Container>
  );
};

CreateChannelModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  serverId: PropTypes.string.isRequired,
};

export default CreateChannelModal;
