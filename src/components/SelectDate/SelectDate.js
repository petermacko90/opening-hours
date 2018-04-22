// displays a date input which sets "today" date in App component
import React from 'react';

const SelectDate = ({ today, setDate, changeDate }) => {
	return (
		<div className="mw6 center mt4 pl1">
      <label htmlFor="selectDate">Vyberte dátum: </label>
      <input
      	type="date"
      	name="selectDate"
      	id="selectDate"
      	value={today}
      	onChange={setDate}
      />
      <div>
        <button
          title="Predchádzajúci týždeň"
          onClick={() => changeDate(-7)}>
          &lt;
        </button>
        <button
          title="Nasledujúci týždeň"
          onClick={() => changeDate(7)}>
          &gt;
        </button>
      </div>
    </div>
	);
}

export default SelectDate;