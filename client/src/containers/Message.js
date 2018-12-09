import Message from '../components/Message';
import { clearMessages } from '../store/actions';
import { connect } from 'react-redux';

const mapStateToProps = state => {
	return {
		messages: state.messages,
    turn: state.turn
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onClearMessages() {
			dispatch(
				clearMessages()
			)
		}
	};
};

export default connect(mapStateToProps,mapDispatchToProps)(Message);
