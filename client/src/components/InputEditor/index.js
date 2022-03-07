import React, { useState } from 'react';
import PropTypes from 'prop-types';
import StyledTextfield from '../../common/StyledTextfield';

const InputEditor = (props) => {
  const { prepareMessage } = props;
  const [value, setValue] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    prepareMessage(value);
  };

  const handleValueChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <form onSubmit={onSubmit}>
      <StyledTextfield
        id="main-chat-input"
        label={null}
        value={value}
        onChange={handleValueChange}
        injectCss={`
          border: none;
          &:focus-within {
            border: none;
          }
        `}
        {...props}
      />
    </form>
  );
};

InputEditor.propTypes = {
  prepareMessage: PropTypes.func.isRequired,
};

export default InputEditor;
