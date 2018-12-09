const _ = require('lodash');

var game = function(playerOneId){
  var GAME = this;
  GAME.playerOne = {
    id            : playerOneId,
    score         : 0,
    hand          : [],
    turn          : true,
    disconnected  : false
  };
  GAME.playerTwo = {
    id            : null,
    score         : 0,
    hand          : [],
    turn          : false,
    disconnected  : false
  };
  GAME.marketResources = {
    Ruby    : [7, 7, 5, 5, 5],
    Gold    : [6, 6, 5, 5, 5],
    Metal   : [5, 5, 5, 5, 5],
    Cloth   : [5, 3, 3, 2, 2, 1, 1],
    Food    : [5, 3, 3, 2, 2, 1, 1],
    Leather : [4, 3, 2, 1, 1, 1, 1, 1, 1]
  };
  GAME.deck = require('./deck');
  GAME.marketHand = ["Ship", "Ship", "Ship"];

  function takeCard(){
    if(GAME.deck.length){
      let index = _.random(0, GAME.deck.length-1);
      return GAME.deck.splice(index, 1)[0];
    }else{
      return new Error("The Deck is empty!");
    }
  }

  GAME.prepareGame = function(playerTwoId){
    return new Promise(function(resolve, reject){
      GAME.playerTwo.id = playerTwoId;
      for(let i=0; i<5; i++){
        GAME.playerTwo.hand.push(takeCard());
        GAME.playerOne.hand.push(takeCard());
      }
      GAME.marketHand.push(takeCard());
      GAME.marketHand.push(takeCard());
      return resolve();
    });
  };

  GAME.takeAction = function(playerId, playerSelect, marketSelect){
    return new Promise(function(resolve, reject){
      var thisPlayer = (playerId === GAME.playerOne.id ? GAME.playerOne : GAME.playerTwo),
          opponentPlayer = (thisPlayer.id === GAME.playerOne.id ? GAME.playerTwo : GAME.playerOne),
          result = {
            thisPlayer : {
              message : '',
              stats   : thisPlayer
            },
            opponentPlayer : {
              message : '',
              stats   : opponentPlayer
            }
          };

      // Player is taking Ship(s) from Market Hand.
      // ******************************************
      if(marketSelect.indexOf("Ship") !== -1 && !playerSelect.length){
        marketSelect.forEach(function(card){
          GAME.marketHand.splice(GAME.marketHand.indexOf(card), 1);
          GAME.marketHand.push(takeCard());
          thisPlayer.hand.push(card);
        });
        result.thisPlayer.message = marketSelect.join(', ') + ' have been taken from the Market.';
        result.opponentPlayer.message = 'Opposing Player has taken '+marketSelect.join(', ')+' from the Market.';
        return resolve(result);
      // Player is taking single card from Market Hand.
      // *********************************************
      }else if(marketSelect.length === 1 && !playerSelect.length){
        if(thisPlayer.hand.filter(function(card){return card !== 'Ship';}).length === 7){
          return reject('You have reached the Card limit! You must Sell or Trade Cards.');
        }

        GAME.marketHand.splice(GAME.marketHand.indexOf(marketSelect[0]), 1);
        GAME.marketHand.push(takeCard());
        thisPlayer.hand.push(marketSelect[0]);
        result.thisPlayer.message = marketSelect[0] + ' has been taken from the Market.';
        result.opponentPlayer.message = 'Opposing Player has taken '+marketSelect[0]+' from the Market.';
        return resolve(result);
      // Player is Selling Card(s)
      // ************************
      }else if(!marketSelect.length && playerSelect.length){
        if(playerSelect[0] === 'Ship') return reject('You can not Sell Ship(s)!');
        if(!playerSelect.every(function(card){ return card === playerSelect[0]; })){
          return reject('Selling Card(s) must be of the same type.');
        }

        var sellScore = 0;
        playerSelect.forEach(function(card){
          if(GAME.marketResources[card].length){
            sellScore += +GAME.marketResources[card].splice(0, 1);
            thisPlayer.hand.splice(thisPlayer.hand.indexOf(card), 1);
          }
        });

        thisPlayer.score += sellScore;
        result.thisPlayer.message = 'You have Sold '+playerSelect.length+' '+playerSelect[0]+' to the Market and earned '+sellScore+' points!';
        result.opponentPlayer.message = 'Opposing Player has Sold '+playerSelect.length+' '+playerSelect[0]+' to the Market and earned '+sellScore+' points.';
        return resolve(result);
      // Player is Trading Cards
      // ************************
      }else if(marketSelect.length === playerSelect.length){
        if(playerSelect.length < 2) return reject('You must trade at least 2 or more Cards.');
        for(var i=0;i<playerSelect.length;i++){
          if(marketSelect.indexOf(playerSelect[i]) !== -1){
            return reject('Can not trade a Market Selected Card with the same type as a Player Selected Card.');
          }
        }

        // Swap Cards here...
        playerSelect.forEach(function(card){
          thisPlayer.hand.splice(thisPlayer.hand.indexOf(card), 1);
          GAME.marketHand.push(card);
        });

        marketSelect.forEach(function(card){
          GAME.marketHand.splice(GAME.marketHand.indexOf(card), 1);
          thisPlayer.hand.push(card);
        });

        result.thisPlayer.message = 'You have Traded '+playerSelect.join(', ')+' to the Market for '+marketSelect.join(', ')+'.';
        result.opponentPlayer.message = 'Opposing Player has Traded '+playerSelect.join(', ')+' to the Market for '+marketSelect.join(', ')+'.';
        return resolve(result);
      }

      return reject('Invalid Action!');
    });
  };
};

module.exports = game;
