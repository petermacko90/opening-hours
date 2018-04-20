// displays opening hours according to selected "today" date
// from component SelectDate
import React from 'react';

class OpeningHours extends React.Component {
  
  // get monday of inputted date
  getMonday = (date) => {
    const d = new Date(date);
    let day = d.getDay();
    let diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  // add days to inputted date
  addDays = (date, days = 6) => {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  // check if inputted date is in "holidays"
  // if true, return corresponding holiday object
  isDateInHolidays = (d) => {
    for (let i = 0, l = this.props.hours.holidays.length; i < l; i++) {
      if (this.props.hours.holidays[i].date.getTime() === d.getTime()) {
        return this.props.hours.holidays[i];
      }
    }
    return false;
  }

  // from inputted JS weekday number (starting with sunday),
  // return SK weekday number (starting with monday)
  getWeekdaySK = (day) => {
    if (day === 0) {
      return 6;
    } else {
      return day - 1;
    }
  }

  render() {
    const days = ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota', 'Nedeľa'];
    const { today, hours } = this.props;
    let date = new Date(today);
    let openingHours = [];

    for (let d = this.getMonday(date), sunday = this.addDays(d); d <= sunday; d.setDate(d.getDate() + 1)) {
      let weekdaySK = this.getWeekdaySK(d.getDay());
      let holiday = this.isDateInHolidays(d);
      let text = '';

      if (holiday) {
        text = <span>Zatvorené {holiday.description ? `- ${holiday.description}` : ''}</span>;
      } else if (hours.closed.includes(weekdaySK)) {
        text = <span>Zatvorené</span>;
      } else {
        text = <span>{`${hours.stableFrom} - ${hours.stableTo} (obedná prestávka: ${hours.lunchFrom} - ${hours.lunchTo})`}</span>;
      }

      openingHours.push(
        <div key={weekdaySK}>
          <p className="w-40 dib pl1">
            {days[weekdaySK]} ({d.toLocaleDateString("sk-SK")})
          </p>
          <p className="w-60 dib">{text}</p>
        </div>
      );
    }

  	return (
  		<div className="mw7-l mw-8-m mw-100 center mt4">
        {openingHours}
    	</div>
  	);
  }
}

export default OpeningHours;