// =================
// VARIABLES
// =================

mapboxgl.accessToken = 'pk.eyJ1Ijoia29kcGUiLCJhIjoiY2w4dXNuYmdkMDc0ZjQybzFiMHN6YmNieCJ9.Q5nbpWQl_hnvVI4o1TZOKA'
// NOTE: If forking please get your own mapbox token from https://www.mapbox.com/

// Strings for the date
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

// DOM elements
const panelElements = [] // the fields in the info panel in the header bar
panelElements[0] = document.querySelector('#iss-long')
panelElements[1] = document.querySelector('#iss-lat')
panelElements[2] = document.querySelector('#iss-alt')
panelElements[3] = document.querySelector('#iss-vel')
const time = document.querySelector('#time') // the time...
const date = document.querySelector('#date') // ... and date in clock panel

let map, ISS, ISS_marker // used by createMap() function and to move the marker

// Marker legends
const ISSloc = document.createElement('div') // the "ISS" marker text
ISSloc.className = 'marker iss-loc';
const ISSvis = document.createElement('div') // to show sun/moon icon depending of if ISS is in daylight/eclipsed
ISSvis.id = 'iss-vis'
ISSvis.className = 'iss-vis'
ISSloc.appendChild(ISSvis)


// =================
// HELPER FUNCTIONS
// =================

/*
 * @desc Add leading zero
 * @param num (int)
 * @return string
 */
const format = (num) => {
	return num < 10 ? `0${num}` : num
}

/*
 * @desc Converts decimal degrees to deg, mins, secs
 * @param deg (float) - decimal degrees
 * @param type (string) - either 'longitude' or 'latitude'
 * @return string
 */
const getDMS = (deg, type) => {

	let arr = ['S', 'N'] // type = 'latitude'
	if (type == 'longitude') {
		arr = ['W', 'E']
	}

	const str = deg < 0 ? arr[0] : arr[1]
	const degAbs = Math.abs(deg)
	const degrees = Math.floor(degAbs)
	const mins = format(Math.floor((degAbs - degrees) * 60))
	const secs = format(Math.round((3600 * (degAbs - degrees) - 60 * mins) * 100) / 100)

	return `${degrees}&#176; ${mins}' ${secs}" ${str}`

}


// =================
// FUNCTIONS
// =================

/*
 * @desc Set up the map
 */
const createMap = async () => {

    const ISS_data = await fetchISSdata()
	
	document.querySelector('#map-container').innerHTML = '';

    map = await new mapboxgl.Map({
        container: 'map-container',
        // style: 'mapbox://styles/mapbox/navigation-guidance-night-v2',
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [ISS_data.longitude, ISS_data.latitude],
		zoom: 3.5,
		minZoom: 1.75,
		maxZoom: 9
    })

    map.addControl(new mapboxgl.NavigationControl({
        showCompass: false
    }))

    ISS = new mapboxgl.Marker()
	.setLngLat([ISS_data.longitude, ISS_data.latitude])
	.addTo(map)

	ISS_marker = new mapboxgl.Marker(ISSloc)
	.setLngLat([ISS_data.longitude, ISS_data.latitude])
    .addTo(map)

}

/*
 * @desc Get the current location of the ISS
 * @return obj
 */
const fetchISSdata = async () => {

    const ISS_data = await fetch('https://api.wheretheiss.at/v1/satellites/25544')
	return await ISS_data.json()

}

/*
 * @desc Reposition the marker on the map
 * @param ISS_data obj - the ISS data object
 */
const repositionMarker = (ISS_data) => {

    ISS.setLngLat([ISS_data.longitude, ISS_data.latitude])
	ISS_marker.setLngLat([ISS_data.longitude, ISS_data.latitude])

}

/*
 * @desc Update the info panels
 * @param ISS_data obj - the ISS data object
 */
const updatePanel = (ISS_data) => {

	// Longitude and latitude with conversion to DMS
	panelElements[0].innerHTML = `${ISS_data.longitude.toFixed(4)}&#176;<br><span class="dms">${getDMS(ISS_data.longitude, 'longitude')}</span>`
	panelElements[1].innerHTML = `${ISS_data.latitude.toFixed(4)}&#176;<br><span class="dms">${getDMS(ISS_data.latitude)}</span>`
	// Altitude and velocity with converstion from Km to miles
	let altitude = parseFloat(Math.round(ISS_data.altitude * 100) / 100).toFixed(2)
	panelElements[2].innerHTML = `${altitude} Km<br><span class="dms">${(Math.round(altitude/1.609344 * 100) / 100).toFixed(2)} miles</span>`
	let velocity = parseFloat(Math.round(ISS_data.velocity * 100) / 100).toFixed(2)
	panelElements[3].innerHTML = `${velocity} Km/h<br><span class="dms">${(Math.round(velocity/1.609344 * 100) / 100).toFixed(2)} mph</span>`

	// update icon on marker
	if (ISS_data.visibility === 'eclipsed') {
		ISSvis.classList.add('iss-vis-eclipsed') // show moon icon when ISS eclipsed
	} else {
		ISSvis.classList.remove('iss-vis-eclipsed') // show sun icon when ISS in daylight
	}

}

/*
 * @desc Run the clock
 */
const runClock = () => {

	var d = new Date()
	time.innerHTML = `${format(d.getHours())}:${format(d.getMinutes())}<span class="seconds">:${format(d.getSeconds())}</span>`
	date.innerHTML = `${days[d.getDay()]}, ${format(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}`
	setTimeout(function() { runClock(); }, 1000)

}

/*
 * @desc Button to centre on ISS was clicked
 */
const centreOnISS = async () => {

    const ISS_data = await fetchISSdata()
	map.flyTo({
		center: [ISS_data.longitude, ISS_data.latitude]
	})

}


/*
 * @desc The loop to continuously update the ISS location data
 */
const run = async () => {

	const ISS_data = await fetchISSdata()
	repositionMarker(ISS_data)
	updatePanel(ISS_data)
    setTimeout(() => {
		run()
	}, 1000)

}

// =================
// LET'S GO....
// =================

createMap()
runClock()
run()
