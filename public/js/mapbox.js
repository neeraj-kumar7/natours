/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibmVlcmFqcDciLCJhIjoiY2xnMzljNGtzMDkwazNqbjE3Nmx1b3JwaiJ9.k4t4HXV90KizlLgLI7pAoQ';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/neerajp7/clg3brmcj003901mwdcpbswc7',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // extend map bounds
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 250,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
