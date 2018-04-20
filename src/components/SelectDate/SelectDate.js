// displays a date input which sets "today" date in App component
import React from 'react';

const SelectDate = ({ today, setDate }) => {
	return (
		<div className="mw6 center mt4 pl1">
      <label htmlFor="selectDate">Vyberte dátum: </label>
      <input
      	type="date"
      	name="selectDate"
      	id="selectDate"
      	defaultValue={today}
      	onChange={setDate}
      />
    </div>
	);
}

export default SelectDate;