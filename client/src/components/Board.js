import React from 'react';
import { PropTypes } from 'prop-types';
import {
  List,
  Container,
  Statistic,
  Card,
  Image,
  Button,
  Divider,
  Transition } from 'semantic-ui-react';
import Ship from '../assets/images/spaceship.png';
import Ruby from '../assets/images/cut-diamond.png';
import Gold from '../assets/images/gold-stack.png';
import Metal from '../assets/images/ring.png';
import Cloth from '../assets/images/rolled-cloth.png';
import Food from '../assets/images/olive.png';
import Leather from '../assets/images/mail-shirt.png';

const Board = ({marketResources,
                  marketHand,
                  turn,
                  playerHand,
                  score,
                  selectCard=f=>f,
                  takeAction=f=>f}) => {

  let images = {
    Ship : Ship,
    Ruby : Ruby,
    Gold : Gold,
    Metal : Metal,
    Cloth : Cloth,
    Food : Food,
    Leather : Leather
  };

  return (
    <Container className="board-container">
      <div>
        <div>
          <List id="resource" size='huge' horizontal>
            {Object.keys(marketResources).map((resource, i) =>
              <List.Item key={i}>
                <Image
                  avatar
                  src={images[resource]}
                />
                <List.Content>
                  <List.Header className="resource-header">
                    {resource}
                  </List.Header>
                  {marketResources[resource].map((value, j) =>
                    <span className="resource-chip" key={j}>
                      <span className="resource-number">{value}</span>
                    </span>
                  )}
                </List.Content>
              </List.Item>
            )}
          </List>
        </div>
        <div id="hand" className="hand-container">
          <Card.Group itemsPerRow={5} centered>
            {marketHand.map((card, i) =>
              <Transition key={i} animation="pulse" duration="500" visible={!card.selected}>
                <Card
                  raised
                  size='small'
                  className={card.selected ? 'selected' : 'not-selected'}
                  onClick={() => selectCard('market', i)}
                >
                  <Image
                    src={images[card.type]}
                  />
                  <Card.Content>
                    <Card.Header>
                      {card.type}
                    </Card.Header>
                  </Card.Content>
                </Card>
              </Transition>
            )}
          </Card.Group>
        </div>
        <Divider />
        <div>
          <Button
            size='massive'
            onClick={() => takeAction(playerHand, marketHand)}
          >
            Take Action
          </Button>
        </div>
        <div id="hand" className="hand-container">
          <Card.Group itemsPerRow={playerHand.length > 5 ? playerHand.length : 5} centered>
            {playerHand.map((card, i) =>
              <Transition key={i} animation="pulse" duration="500" visible={!card.selected}>
                <Card
                  raised
                  size='small'
                  className={card.selected ? 'selected' : 'not-selected'}
                  onClick={() => selectCard('player', i)}
                >
                  <Image
                    src={images[card.type]}
                  />
                  <Card.Content>
                    <Card.Header>
                      {card.type}
                    </Card.Header>
                  </Card.Content>
                </Card>
              </Transition>
            )}
          </Card.Group>
        </div>
      </div>
      <div>
        <Statistic label='Score' value={score} />
      </div>
    </Container>
  );
};

Board.propTypes = {
  marketResources: PropTypes.object,
  marketHand: PropTypes.array,
  playerHand: PropTypes.array,
  turn: PropTypes.bool,
  score: PropTypes.number,
  selectCard: PropTypes.func,
  takeAction: PropTypes.func
};

export default Board;
