import GameArea from '../components/GameArea';
import { startGame } from '../store/actions';
import { connect } from 'react-redux';

const mapStateToProps = state => {
	return {
		playerId: state.playerId
	};
};

const mapDispatchToProps = dispatch => {
	return {
    onStartGame(){
      dispatch(startGame())
    }
	};
};

export default connect(mapStateToProps,mapDispatchToProps)(GameArea);
