import React from 'react';
import { PropTypes } from 'prop-types';
import Board from '../containers/Board';
import { Button } from 'semantic-ui-react';



const GameArea = ({playerId, onStartGame=f=>f}) => {
  return (
    <div className="gamearea-container">
      {!playerId ?
        <Button size='massive' onClick={() => onStartGame()}>
          Find or Start Game!
        </Button> :
        <div>
          <p>Here is your ID: {playerId}</p>
          <Board />
        </div>
      }
    </div>
  );
};

GameArea.propTypes = {
  playerId: PropTypes.string,
  onStartGame: PropTypes.func
};

export default GameArea;
