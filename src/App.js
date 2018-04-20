import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import SelectDate from './components/SelectDate/SelectDate';
import OpeningHours from './components/OpeningHours/OpeningHours';
import Administration from './components/Administration/Administration';

class App extends Component {
  constructor() {
    const d = new Date();
    super();
    this.state = {
      isSignedIn: false,
      today: new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())),
      openingHours: {
        stableFrom: '09:00',
        stableTo: '17:00',
        lunchFrom: '11:30',
        lunchTo: '12:30',
        closed: [5, 6],
        holidays: [
          {
            date: new Date("2018-05-01"),
            description: "Sviatok práce"
          },
          {
            date: new Date("2018-05-08"),
            description: "Deň víťazstva nad fašizmom"
          },
          {
            date: new Date("2018-04-19"),
            description: ""
          }
        ]
      }
    };
  }

  // sign in as admin, for now just toggles a boolean state variable,
  // which controls showing either Administration component or
  // OpeningHours component
  signIn = () => {
    this.setState({isSignedIn: !this.state.isSignedIn});
  }

  // set "today" date inputted in component SelectDate
  setDate = (event) => {
    // only set "today" date if the inputted value is not empty
    if (event.target.value) {
      this.setState({today: event.target.value});  
    }
  }

  // set openingHours object with data from Administration component
  setOpeningHours = (data) => {
    this.setState({openingHours: data});
  }

  render() {
    const { isSignedIn, today, openingHours } = this.state;

    return (
    	<div className="helvetica">
      	<Navigation onClick={this.signIn} isSignedIn={isSignedIn} />
        {
          isSignedIn ?
            <Administration
              hours={openingHours}
              setOpeningHours={this.setOpeningHours}
            />
          :
            <div>
              <SelectDate today={today} setDate={this.setDate} />
              <OpeningHours
                today={today}
                hours={openingHours}
              />
            </div>
        }
      </div>
    );
  }
}

export default App;