export default function latLongBlock(){
    const latLongBlock = document.createElement('div');
    latLongBlock.className = 'lat-long-block';

    const map = document.createElement('div');
    map.id = 'map';

    const lat = document.createElement('div');
    lat.className = 'lat-long-block__lat';

    const long = document.createElement('div');
    long.className = 'lat-long-block__long';


    latLongBlock.appendChild(map);
    latLongBlock.appendChild(lat);
    latLongBlock.appendChild(long);

    return latLongBlock;
}
