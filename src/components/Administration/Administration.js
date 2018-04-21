// displays admin options
// accepts the "openingHours" object from App component
// and creates its own state based on it
import React from 'react';
import Notification from '../Notification/Notification';

class Administration extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			stableFrom: props.hours.stableFrom,
      stableTo: props.hours.stableTo,
      lunchFrom: props.hours.lunchFrom,
      lunchTo: props.hours.lunchTo,
      closed: props.hours.closed,
      holidays: props.hours.holidays,
      holidayFrom: '',
      holidayTo: '',
      holidayNote: '',
      notification: {
      	show: false,
      	text: '',
      	type: ''
      }
		};
	}

	// set notification, hide it by default
	setNotification = (show = false, text = '', type = '') => {
		this.setState({notification: {show, text, type}});
	}

	// handle change of multiple inputs and save to state
	handleInputChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;

		this.setState({
			[name]: value
		});
		this.props.setUnsavedChanges(true);
	}

	// save to state the days in week when it's closed
	saveClosedDays = (event) => {
    let options = event.target.options;
    let closedDays = [];

    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        closedDays.push(options[i].value);
      }
    }

    this.setState({closed: closedDays});
    this.props.setUnsavedChanges(true);
  }

  // add range of days to "holiday"
  addHoliday = () => {
  	const { holidayFrom, holidayTo, holidayNote } = this.state;
  	let d = new Date(holidayFrom);
  	const toDate = new Date(holidayTo);
  	let holidaysAdd = [];

  	this.setNotification();

  	// if holiday from or holiday to date input value is empty,
  	// show error notification and return
  	if (!holidayFrom || !holidayTo) {
  		this.setNotification(true, 'Zadajte dátumy od a do pre dovolenku!', 'error');
  		return;
  	}

  	// if holiday from date is higher than holiday to date,
  	// show error and return
  	if (holidayTo < holidayFrom) {
  		this.setNotification(true, 'Nastavili ste chybný rozsah dátumov!', 'error');
  		return;
  	}

		// go through inputted day range
  	for (; d <= toDate; d.setDate(d.getDate() + 1)) {
  		if (this.isDateInHolidays(d)) {
  			// if day is already in "holiday", show error and return
  			this.setNotification(true, `Dátum ${d.toLocaleDateString("sk-SK")} už je uložený!`, 'error');
  			return;
			} else {
				// otherwise insert day to local holiday array
				holidaysAdd.push({date: new Date(d), description: holidayNote});
			}
	  }
	  
	  // concat local holiday array to state holiday array
	  // and show success notification
	  this.setState({holidays: this.state.holidays.concat(holidaysAdd)});
	  this.props.setUnsavedChanges(true);
	  this.setNotification(true, 'Dovolenka pridaná', 'success');
  }

  // return true if date is saved in holidays
  isDateInHolidays = (d) => {
  	for (let i = 0, l = this.state.holidays.length; i < l; i++) {
			if (this.state.holidays[i].date.getTime() === d.getTime()) {
				return true;
			}
		}
		return false;
	}

	// remove selected holiday
  removeHoliday = (date) => {
  	let holidays = this.state.holidays.slice();
  	let allow = window.confirm(`Prajete si vymazať dátum ${date.toLocaleDateString("sk-SK")} z voľných dní?`);

  	this.setNotification();

  	if (allow) {
  		for (let i = 0, l = holidays.length; i < l; i++) {
  			if (holidays[i].date.getTime() === date.getTime()) {
  				holidays.splice(i, 1);
  				this.setState({holidays});
  				this.setNotification(true, 'Vymazané', 'success');
  				break;
  			}
  		}
  		this.props.setUnsavedChanges(true);
  	}
  }

  // validate opening hours
  // for example if "open from" hour is less than "open to" hour
  // return true if it's alright
  validateOpeningHours = (stableFrom, stableTo, lunchFrom, lunchTo) => {
  	if (stableFrom < stableTo && lunchFrom < lunchTo
  		&& stableFrom < lunchFrom && lunchTo < stableTo) {
  			return true;
  	}
  	return false;
  }

  // compose the openingHours object and pass it to App component
  // if stable opening hours are valid
  onSubmit = () => {
  	const {closed, holidays, lunchFrom, lunchTo, stableFrom, stableTo} = this.state;

  	this.setNotification();

  	if (this.validateOpeningHours(stableFrom, stableTo, lunchFrom, lunchTo)) {
	  	const openingHours = {
	  		stableFrom,
	      stableTo,
	      lunchFrom,
	      lunchTo,
	      closed,
	      holidays
	  	};

	  	this.props.setOpeningHours(openingHours);
	  	this.props.setUnsavedChanges(false);
	  	this.setNotification(true, 'Zmeny uložené', 'success');
	  } else {
	  	this.setNotification(true, 'Chyba v stabilných otváracích hodinách!', 'error');
	  	return;
	  }
  }

	render() {
		const days = ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa'];
		const { stableFrom, stableTo, lunchFrom, lunchTo, closed, holidays, holidayFrom, holidayTo, holidayNote, notification } = this.state;

		// sort holidays ascending by date
		holidays.sort((a, b) => {
			return a.date - b.date;
		});

		return (
			<div className="mw7 pl1 center">
				{
					notification.show &&
						<Notification
							onClick={() => this.setNotification()}
							text={notification.text}
							type={notification.type}
						/>
				}
				<button
					className="mt3 green bg-white ba b--green hover-white bg-animate hover-bg-green pa2 b pointer"
					onClick={this.onSubmit}>
					Uložiť zmeny
				</button>

				<h2 className="f3-l f4">Stabilné otváracie hodiny</h2>
				<div className="w-25-l w-third-m w-100 dib mb1">
					<label htmlFor="stableFrom">Od: </label>
					<input
						type="time"
						name="stableFrom"
						id="stableFrom"
						defaultValue={stableFrom}
						onChange={this.handleInputChange}
					/>
				</div>
				<div className="w-25-l w-third-m w-100 dib">
					<label htmlFor="stableTo">Do: </label>
					<input
						type="time"
						name="stableTo"
						id="stableTo"
						defaultValue={stableTo}
						onChange={this.handleInputChange}
					/>
				</div>
				<p>Obedová prestávka</p>
				<div className="w-25-l w-third-m w-100 dib mb1">
					<label htmlFor="lunchFrom">Od: </label>
					<input
						type="time"
						name="lunchFrom"
						id="lunchFrom"
						defaultValue={lunchFrom}
						onChange={this.handleInputChange}
					/>
				</div>
				<div className="w-25-l w-third-m w-100 dib">
					<label htmlFor="lunchTo">Do: </label>
					<input
						type="time"
						name="lunchTo"
						id="lunchTo"
						defaultValue={lunchTo}
						onChange={this.handleInputChange}
					/>
				</div>

				<h2 className="f3-l f4">Zatvorené</h2>
				<select
					multiple="multiple"
					className="w-25-l w-third-m w-100"
					size={days.length}
					defaultValue={closed}
					onChange={this.saveClosedDays}
				>
					{ days.map((day, i) => <option key={i} value={i}>{day}</option>) }
				</select>

				<h2 className="f3-l f4">Dovolenka</h2>
				<p>Pridať dovolenku</p>

				<div className="w-30-l w-50-m w-100 dib mb1">
					<label htmlFor="holidayFrom">Od (vrátane): </label>
					<input
						type="date"
						name="holidayFrom"
						id="holidayFrom"
						defaultValue={holidayFrom}
						onChange={this.handleInputChange}
					/>
				</div>
				<div className="w-30-l w-50-m w-100 dib mb1">
					<label htmlFor="holidayTo">Do (vrátane): </label>
					<input
						type="date"
						name="holidayTo"
						id="holidayTo"
						defaultValue={holidayTo}
						onChange={this.handleInputChange}
					/>
				</div>
				<div className="w-30-l w-50-m w-100 dib mb1">
					<input
						type="text"
						placeholder="Poznámka"
						name="holidayNote"
						id="holidayNote"
						defaultValue={holidayNote}
						onChange={this.handleInputChange}
					/>
				</div>
				<div className="w-10-l w-50-m w-100 dib">
					<button
						className="green bg-white ba b--green hover-white bg-animate hover-bg-green b pa1 pointer"
						onClick={this.addHoliday}>
						Pridať
					</button>
				</div>

				<p>Zoznam voľných dní</p>
				{
					holidays.map((holiday) => {
						return (
							<div key={holiday.date.toLocaleDateString("sk-SK")}>
								<div className="w-40 dib">
									<button
										className="dark-red bg-white b ba b--dark-red hover-white bg-animate hover-bg-dark-red pointer"
										title="Vymazať"
										onClick={() => this.removeHoliday(holiday.date)}>
										&times;
									</button>
									<p className="dib pl2">
										{holiday.date.toLocaleDateString("sk-SK")}
									</p>
								</div>
								<p className="w-60 dib pl1">{holiday.description}</p>
							</div>
						);
					})
				}
			</div>
		);
	}
}

export default Administration;