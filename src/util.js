import { Circle, Popup } from 'react-leaflet'
import L from 'leaflet'
import React from 'react'
import numeral from 'numeral'

export const sortData = (data) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
        if (a.cases > b.cases){
            return -1;
        }
        else{
            return 1
        }
    })
    return sortedData;
}

export const prettyPrintStat = (stat) =>{
    return stat ? `+${numeral(stat).format('0.0a')}` : ''
}