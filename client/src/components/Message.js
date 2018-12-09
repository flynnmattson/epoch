import React from 'react';
import PropTypes from 'prop-types';
import { Modal,Button } from 'semantic-ui-react';

const Message = ({ messages=[], turn, onClearMessages=f=>f }) =>
  <Modal dimmer="blurring" open={messages.length !== 0}>
    <Modal.Header>Game Message</Modal.Header>
    <Modal.Content>
      {messages.map((message, i) =>
        <p key={i} className="message">
          {message}
        </p>
      )}
    </Modal.Content>
    <Modal.Actions>
      {(turn ?
        <Button
          positive
          labelPosition='right'
          icon='checkmark'
          content='Okay'
          onClick={() => onClearMessages()}
        />
      : <Button loading negative>
          Loading...
        </Button>
      )}
    </Modal.Actions>
  </Modal>;



Message.propTypes = {
    messages: PropTypes.array,
    turn: PropTypes.bool,
    onClearMessages: PropTypes.func
};

export default Message;
