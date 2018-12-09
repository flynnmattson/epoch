import Board from '../components/Board';
import { selectCard, takeAction } from '../store/actions';
import { connect } from 'react-redux';

const mapStateToProps = state => {
	return {
		marketResources: state.marketResources,
    marketHand: state.marketHand,
    turn: state.turn,
    playerHand: state.playerHand,
    score: state.score
	};
};

const mapDispatchToProps = dispatch => {
	return {
    selectCard(type, i){
      dispatch(selectCard(type, i));
    },
    takeAction(playerHand, marketHand){
      dispatch(takeAction(playerHand, marketHand));
    }
	};
};

export default connect(mapStateToProps,mapDispatchToProps)(Board);
