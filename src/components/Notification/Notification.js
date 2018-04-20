// displays a notification (success or error)
// notification hides on click
// state of Notification is maintained by its parent (Administration component)
import React from 'react';
import './Notification.css';

class Notification extends React.Component {
	render () {
		return (
			<div
				className={`notification fixed pointer dim ${this.props.type}`}
				title='Zavrieť'
				onClick={this.props.onClick}>
				{this.props.text}
			</div>
		);
	}
}

export default Notification;