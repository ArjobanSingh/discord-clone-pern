import { useState } from 'react';
import PropTypes from 'prop-types';
import ChatInputField from './styles';

const InputEditor = (props) => {
  const { prepareMessage } = props;
  const [value, setValue] = useState('');

  const onSubmit = () => {
    if (!value.trim()) return;
    prepareMessage(value);
    setValue('');
  };

  const handleValueChange = (e) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <ChatInputField
      onKeyDown={handleKeyDown}
      onChange={handleValueChange}
      value={value}
    />
  );
};

InputEditor.propTypes = {
  prepareMessage: PropTypes.func.isRequired,
};

export default InputEditor;
