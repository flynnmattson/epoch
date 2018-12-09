import C from '../constants';
import io from 'socket.io-client';

const endpoint = 'http://localhost:3001';
var epoch;

export const setPlayerId = (id = '') => {
  return {
    type: C.SET_PLAYER_ID,
    payload: id
  };
};

export const setTurn = (turn) => {
  return {
    type: C.SET_TURN,
    payload: turn
  };
};

export const setScore = (score) => {
  return {
    type: C.SET_SCORE,
    payload: score
  };
}

export const removeMarketResource = (resourceType) => {
  return {
    type: C.REMOVE_MARKET_RESOURCE,
    payload: resourceType
  };
};

export const updateMarketResource = (resources) => {
  return {
    type: C.UPDATE_MARKET_RESOURCE,
    payload: resources
  };
};

export const updateMarketHand = (hand) => {
  return {
    type: C.UPDATE_MARKET_HAND,
    payload: hand
  };
};

export const updatePlayerHand = (hand) => {
  return {
    type: C.UPDATE_PLAYER_HAND,
    payload: hand
  };
};

export const selectCard = (type, index) => {
  return {
    type: (type === 'market' ? C.SELECT_MARKET_CARD : C.SELECT_PLAYER_CARD),
    payload: index
  };
};

export const addError = (message) => {
  return {
    type: C.ADD_ERROR,
    payload: message
  };
};

export const clearError = (index) => {
  return {
    type: C.CLEAR_ERROR,
    payload: index
  };
};

export const addMessage = (message) => {
  return {
    type: C.ADD_MESSAGE,
    payload: message
  };
};

export const clearMessages = () => {
  return {
    type: C.CLEAR_MESSAGE,
    payload: null
  };
};

export const takeAction = (playerHand, marketHand) => {
  epoch.emit(
    'action',
    playerHand
      .filter(card => card.selected)
      .map(card => card.type),
    marketHand
      .filter(card => card.selected)
      .map(card => card.type)
  );
  return;
};

export const startGame = value => dispatch => {
  epoch = io(endpoint);
  epoch.on('connect', (socket) => {

    epoch.on('waitForOpponent', () => {
      dispatch( addMessage('Waiting for Opponent...') );
    });

    epoch.on('startGame', (message, gameState) => {
      dispatch( addMessage(message) );
      dispatch( setGameState(gameState) );
    });

    epoch.on('playerDisconnected', () => {
      dispatch( addMessage('Opposing Player Disconnected!') );
    });

    epoch.on('actionFail', (message) => {
      dispatch( addMessage(message) );
    });

    epoch.on('actionSuccess', (message, gameState) => {
      dispatch( addMessage(message) );
      dispatch( setGameState(gameState) );
    });
  });
};

export const setGameState = value => dispatch => {
  dispatch( setPlayerId(value.playerStats.id) );
  dispatch( setTurn(value.playerStats.turn) );
  dispatch( setScore(value.playerStats.score) );
  dispatch( updatePlayerHand(value.playerStats.hand) );
  dispatch( updateMarketResource(value.marketResources) );
  dispatch( updateMarketHand(value.marketHand) );
};
