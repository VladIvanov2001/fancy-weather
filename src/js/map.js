export default function initMap(longitude, latitude){
    function successCallback(pos){
        mapboxgl.accessToken = 'pk.eyJ1IjoidmxhZHVzaGEyMjgiLCJhIjoiY2s0NGRuYzAyMDE4ODNvbno2ZnhmN3owMyJ9.rHM_J8WxwyKXv41aDVj0mA';
        const mapSettings = {
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: 10
        };
        const map = new mapboxgl.Map(mapSettings);
    }
    navigator.geolocation.getCurrentPosition(successCallback);
}
