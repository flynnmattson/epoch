import C from '../constants';
import { combineReducers } from 'redux';

function deepCopy(obj){
  return JSON.parse(JSON.stringify(obj));
}

export const playerId = (state="", action) =>
  (action.type === C.SET_PLAYER_ID) ?
    action.payload :
    state;

export const turn = (state = false, action) =>
  (action.type === C.SET_TURN) ?
    action.payload :
    state;

export const score = (state = 0, action) =>
  (action.type === C.SET_SCORE) ?
    action.payload :
    state;

export const disconnect = (state = false, action) => {
  switch(action.type){
    case C.DISCONNECT_ON:
      return true;
    case C.DISCONNECT_OFF:
      return false;
    default:
      return state;
  }
};

export const marketResources = (state = {}, action) => {
  if(action.type === C.REMOVE_MARKET_RESOURCE && state && action.payload in state){
    let temp = deepCopy(state);
    temp[action.payload].shift();
    return temp;
  }else if(action.type === C.UPDATE_MARKET_RESOURCE){
    return action.payload;
  }else{
    return state;
  }
};

export const marketHand = (state = [], action) => {
  if(action.type === C.UPDATE_MARKET_HAND){
    return action.payload.map((card) => {
      return {
        type     : card,
        selected : false
      };
    });
  }else if(action.type === C.SELECT_MARKET_CARD){
    let isShip = (state[action.payload] && state[action.payload].type === 'Ship');
    return state.map((card, i) => {
      let selectedState = (action.payload === i || (isShip && card.type === 'Ship') ? !card.selected : card.selected);
      if((!isShip && card.type === 'Ship') || (isShip && card.type !== 'Ship')) selectedState = false;
      return {
        type      : card.type,
        selected  : selectedState
      }
    });
  }else{
    return state;
  }
};

export const playerHand = (state = [], action) => {
  if(action.type === C.UPDATE_PLAYER_HAND){
    return action.payload.map((card) => {
      return {
        type     : card,
        selected : false
      };
    });
  }else if(action.type === C.SELECT_PLAYER_CARD){
    return state.map((card, i) => {
      return {
        type      : card.type,
        selected  : (action.payload === i ? !card.selected : card.selected)
      }
    });
  }else{
    return state;
  }
};

export const errors = (state = [], action) => {
  switch(action.type){
    case C.ADD_ERROR:
      return [
        ...state,
        action.payload
      ];
    case C.CLEAR_ERROR:
      return state.filter((message, i) => i !== action.payload)
    default:
      return state;
  }
};

export const messages = (state = [], action) => {
  switch(action.type){
    case C.ADD_MESSAGE:
      return [
        ...state,
        action.payload
      ];
    case C.CLEAR_MESSAGE:
      return [];
    default:
      return state;
  }
};

export default combineReducers({
  playerId,
  turn,
  score,
  marketResources,
  marketHand,
  playerHand,
  errors,
  messages
});
