import React, { useState } from 'react';
import PropTypes from 'prop-types';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
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

const inputNames = {
  channelType: 'channel-type-buttons-group',
  channelName: 'channel-name',
};

const radios = [{
  value: ChannelType.TEXT,
  icon: <Tag fontSize="1.5rem" />,
  title: 'Text',
  description: 'Send messages, images, videos and more',
}, {
  value: ChannelType.AUDIO,
  icon: <VolumeUpIcon />,
  title: 'Voice',
  description: 'Hang out together with voice, video and screen share',
}];

const CreateChannelModal = (props) => {
  const { closeModal } = props;
  const [channelType, setChannelType] = useState(ChannelType.TEXT);
  const [channelName, setChannelName] = useState('');

  const handleChange = (e) => {
    const { value, name } = e.target;
    if (inputNames.channelType === name) setChannelType(value);
    else {
      setChannelName(value);
    }
  };

  const createChannel = () => {};

  return (
    <Container>
      <ModalBody>
        <Form>
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
            <StyledCloseIcon
              onClick={closeModal}
            />
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
              label={(
                <Typography variant="caption" fontWeight="fontWeightBold">
                  CHANNEL NAME
                </Typography>
              )}
              placeholder="new-channel"
              name={inputNames.channelName}
              value={channelName}
              onChange={handleChange}
              startIcon={channelType === ChannelType.TEXT
                ? <Tag fontSize="1.25rem" /> : <VolumeUpIcon fontSize="small" />}
            />
          </Box>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="info"
          color="text.primary"
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={createChannel}
        >
          Create Channel
        </Button>
      </ModalFooter>
    </Container>
  );
};

CreateChannelModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default CreateChannelModal;
