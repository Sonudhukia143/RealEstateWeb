export default function fetchMap(loc) {
  if (loc && window.mappls) {
    const map = new window.mappls.Map("map", {
      center: [loc.lat, loc.lon],
      zoom: 14,
      zoomControl: true,
      location: true,
    });

    map.on("load", function () {
      new window.mappls.Marker({
        map,
        position: { lat: loc.lat, lng: loc.lon },
        popup_html: "📍 You are here",
        draggable: false
      });
    });
  }
}
