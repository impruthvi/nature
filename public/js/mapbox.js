/* eslint-disable */
export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiaW1wcnV0aHZpIiwiYSI6ImNsYWttcXNhcjAxYmgzb3N6OTA1NDc3Y20ifQ.XLJ3M84DymJOqvFMjobS2w';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/impruthvi/clako2lfo005m14molkqw7yz4',
    scrollZoom: false
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    // new mapboxgl.Popup({
    //   offset: 10
    // })
    //   .setLngLat(loc.coordinates)
    //   .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    //   .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
