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
      unsavedChanges: false, 
      today: `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`,
      openingHours: {
        stableFrom: '09:00',
        stableTo: '17:00',
        lunchFrom: '11:30',
        lunchTo: '12:30',
        closed: [5, 6],
        holidays: [
          {
            dateFrom: new Date("2018-05-01"),
            dateTo: new Date("2018-05-01"),
            description: "Sviatok práce"
          },
          {
            dateFrom: new Date("2018-05-08"),
            dateTo: new Date("2018-05-08"),
            description: "Deň víťazstva nad fašizmom"
          },
          {
            dateFrom: new Date("2018-04-23"),
            dateTo: new Date("2018-04-27"),
            description: "dovolenka"
          }
        ]
      }
    };
  }

  // sign in as admin, for now just toggles a boolean state variable,
  // which controls showing either Administration component or
  // OpeningHours component
  signIn = () => {
    let allow = true;

    // if there are unsaved changes, show confirm
    // if user then clicks "cancel", return
    if (this.state.unsavedChanges && this.state.isSignedIn) {
      allow = window.confirm("Neuložili ste zmeny. Chcete sa odhlásiť?");
      if (!allow) {
        return;
      }
    }

    this.setState({isSignedIn: !this.state.isSignedIn});
    this.setState({unsavedChanges: false});
  }

  // set "today" date inputted in component SelectDate
  setDate = (event) => {
    // only set "today" date if the inputted value is not empty
    if (event.target.value) {
      this.setState({today: event.target.value});  
    }
  }

  // change "today" day -7 or +7 days
  // used in SelectDate component
  changeDate = (change) => {
    let today = new Date(this.state.today);
    
    today.setDate(today.getDate() + change);
    today = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    this.setState({today});
  }

  // handles state of "unsaved changes"
  // used in Administration component
  setUnsavedChanges = (unsavedChanges) => {
    this.setState({unsavedChanges});
  }

  // set openingHours object with data from Administration component
  setOpeningHours = (data) => {
    this.setState({openingHours: data});
  }

  render() {
    const { isSignedIn, today, openingHours, unsavedChanges } = this.state;

    return (
    	<div className="helvetica">
      	<Navigation
          onClick={this.signIn}
          isSignedIn={isSignedIn}
          unsavedChanges={unsavedChanges}
        />
        {
          isSignedIn ?
            <Administration
              hours={openingHours}
              setOpeningHours={this.setOpeningHours}
              setUnsavedChanges={this.setUnsavedChanges}
            />
          :
            <div>
              <SelectDate
                today={today}
                setDate={this.setDate}
                changeDate={this.changeDate}
              />
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