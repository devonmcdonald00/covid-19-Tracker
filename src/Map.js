import React, { useState } from 'react'
import L from 'leaflet'
import { MapContainer as LeafletMap, TileLayer, MapConsumer } from 'react-leaflet';
import './Map.css'
import { showDataOnMap } from './util';
import numeral from 'numeral'


const casesTypeColors = {
    cases: {
        hex: '#CC1034',
        multiplier: 250
    },
    recovered: {
        hex: '#7dd71d',
        multiplier: 500
    },
    deaths: {
        hex: '#fb4443',
        multiplier: 800
    }
}

function Map({ countries, casesType = 'cases', center, zoom, circles }) {

    return (
        <div className='map'>
            <LeafletMap center={L.latLng(center)} zoom={zoom}>
                <MapConsumer>
                    {(map) => {
                        var southWest = L.latLng(-89.98155760646617, -180),
                        northEast = L.latLng(89.99346179538875, 180);
                        var bounds = L.latLngBounds(southWest, northEast);
                        map.setMaxBounds(bounds);
                        map.on('drag', function() {
                            map.panInsideBounds(bounds, { animate: false });
                        });
                        map.setView(L.latLng(center))
                        map.setZoom(zoom)
                        map.eachLayer(function(layer) {
                            if(layer.options.radius){
                                map.removeLayer(layer)
                            }
                          });
                        if(circles){
                            countries.map(country => (
                                (
                                    L.circle(L.latLng(country.countryInfo.lat, country.countryInfo.long), {
                                        color: casesTypeColors[casesType].hex,
                                        fillColor: casesTypeColors[casesType].hex,
                                        fillOpacity: .15,
                                        radius: Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier,
    
                                    }).addTo(map).bindPopup("<div class='popup'><img class='flag' src='" + country.countryInfo.flag + "' }}/><div class='info-name'>" + country.country + "</div><div class='info-container'><div class='info-confirmed'>Cases: " + numeral(country.cases).format('0,0') +"</div><div class='info-recovered'>Recovered: " + numeral(country.recovered).format('0,0') + "</div><div class='info-deaths'>Deaths: " + numeral(country.deaths).format('0,0') + "</div></div></div>")
                                )
                                
                            ))
                        }
                        return null
                    }}
                </MapConsumer>
                <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreet</a> contributors'
                />
            </LeafletMap>
        </div>
    )
}

export default Map


