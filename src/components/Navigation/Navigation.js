// displays a header and link to sign in as admin
import React from 'react';

const Navigation = ({ onClick, isSignedIn }) => {
	return (
		<nav className="bg-light-green flex justify-between items-end">
      <h1 className="f1-l f2-m f3 ma0 pa3">Otváracie hodiny</h1>
      <p
      	className="pr3 link dim underline pointer"
      	onClick={onClick}>
      	{ isSignedIn ? "Odhlásiť sa" : "Prihlásiť sa ako admin" }
      </p>
    </nav>
	);
}

export default Navigation;