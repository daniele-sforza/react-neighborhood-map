# Neighborhood Map Project

I developed a single-page application using **React** featuring a map of my neighborhood with my favorite places to drink a beer.

I added some functionalities to this application, including: map markers to identify the locations, a search function to easily discover these locations, and a list view to support simple browsing of all locations.

I used [Google Maps React](https://github.com/fullstackreact/google-maps-react) component to display the map, markers and infowindow .

I used [Foursquare](https://developer.foursquare.com/) API to provide additional information about each of these locations.



## Features

- All application components render on-screen in a responsive manner and are usable across modern desktop, tablet, and phone browsers.
- The text input field filters the map markers and list items to locations matching the text input or selection.
- Map displays all location markers by default, and displays the filtered subset of location markers when a filter is applied.
- Clicking a location on the list displays information about the location, and animates its associated map marker.



## Requirements

To run the project:

- install all project dependencies with `npm install`

- start the server with `npm start`

- the URL will be `http://localhost:3000/`


## Important

When available in the browser, the site uses a service worker to cache responses to requests for site assets.

The application page is rendered when there is no network access but only browsing the production build of the site [https://daniele-sforza.github.io/react-neighborhood-map/](https://daniele-sforza.github.io/react-neighborhood-map/)