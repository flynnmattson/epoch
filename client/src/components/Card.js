import React from 'react';
import { PropTypes } from 'prop-types';

const Card = ({ type, selected }) => {
  return (
    <div className={selected ? 'selected' : 'not-selected'}>
      <button>
        {type}
      </button>
    </div>
  );
};

Card.propTypes = {
    resort: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    powder: PropTypes.bool,
    backcountry: PropTypes.bool,
    onRemoveDay: PropTypes.func
};

export default Card;
