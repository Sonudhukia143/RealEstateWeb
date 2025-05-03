export default function fetchMap (loc) {
  if(loc){
    if (window.mappls) {
      const map = new window.mappls.Map("map", {
        center: [loc.lat, loc.lon],
        zoomControl: true,
        location: true
      });

      map.on("load", function () {
        new window.mappls.Marker({
          map: map,
          position: { lat: loc.lat, lng: loc.lon },
          popup_html: "📍 Custom Marker",
          draggable: false,
        });
      });
    }
  }
}