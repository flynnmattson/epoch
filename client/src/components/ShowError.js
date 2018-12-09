import React from 'react';
import PropTypes from 'prop-types';

const ShowError = ({ errors=[], onClearError=f=>f }) =>
    <div className="show-errors">
        {(errors.length) ?
          errors.map((message, i) =>
            <div key={i} className="error">
              <p>{message}</p>
              <button onClick={() => onClearError(i)}>X</button>
            </div>
          ) : null
        }
    </div>


ShowError.propTypes = {
    errors: PropTypes.array,
    onClearError: PropTypes.func
};

export default ShowError;
