import { MenuItem, FormControl, Select, Card, CardContent, Switch, FormControlLabel } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import LineGraph from './LineGraph'
import './App.css';
import { sortData } from './util'
import 'leaflet/dist/leaflet.css'
import {prettyPrintStat} from './util'
const statesLoc = require('./states.json')

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('Worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 30.266667, lng: -97.75 })
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState('cases')
  const [mode, setMode] = useState(0)
  const [states, setStates] = useState([])
  const [state, selectState] = useState('TX')
  const [stateInfo, setStateInfo] = useState({})

  useEffect(() => {
    fetch('https:/disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  useEffect(() =>{
    const getStatesData = async () =>{
      await fetch ('https://api.covidtracking.com/v1/states/current.json')
        .then(response => response.json())
        .then(data => {
          setStates(data)
      })
    }
    getStatesData();
    
  }, [])

  useEffect(()=>{
    const getCountriesData = async () => {
      await fetch ('https://disease.sh/v3/covid-19/countries')
      .then(response => response.json())
      .then(data => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ))
        const sortedData = sortData(data)
        setTableData(sortedData)
        setMapCountries(data)
        setCountries(countries)
      })
    }
    getCountriesData();
  }, [])

  const onStateChange = async (event) => {
    const state = event.target.value;
    selectState(state)
    const url = `https://api.covidtracking.com/v1/states/${state}/current.json`
    await fetch(url)
    .then(response => response.json())
    .then(data =>{
      setMapCenter([statesLoc[state]["lat"], statesLoc[state]["long"]])
      setMapZoom(6.2)
      console.log(data)
      setStateInfo(data)
    })
  }

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode)

    const url = countryCode === 'Worldwide' ? 'https://disease.sh/v3/covid-19/all' : `http://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
    .then(response => response.json())
    .then(data =>{
      setCountry(countryCode)
      setCountryInfo(data)
      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(5)
    })
  }

  useEffect(async () => {
    if(mode){
      selectState(state)
      const url = `https://api.covidtracking.com/v1/states/TX/current.json`
      await fetch(url)
      .then(response => response.json())
      .then(data =>{
        setMapCenter([statesLoc['TX']["lat"], statesLoc['TX']["long"]])
        console.log(mapCenter)
        setMapZoom(6.2)
        setStateInfo(data)
      })
    }

  }, [mode])

  const handleModeChange = async (event) =>{
    setMode(!mode);
    if(mode){
      setMapZoom(3)
    }
    else{
      setMapZoom(6.2)
      setMapCenter([30.266667, -97.75])

    }
  }

  return (
    <div className="app">
      <div className='app__left'>
        <div className='app__header'>
          <h1>COVID-19 Tracker</h1>
          <div style={{flex: 0.7, display: 'flex', padding: 0}}>
            <FormControlLabel
              control={
                <Switch
                  checked={mode}
                  value={mode}
                  onChange={handleModeChange}
                  style={{color: '#fc3c3c'}}
                />
              }
              label={!mode ? 'Countries' : 'States'}
              style={{marginTop: 10, marginRight: 30}}
            />
            {
              !mode ? 
              <FormControl>
                <Select
                  variant='outlined'
                  onChange={onCountryChange}
                  value={country}
                  renderValue={() => country}
                  style={{backgroundColor: 'white'}}
                >
                  <MenuItem value='Worldwide'>Worldwide</MenuItem>
                  {
                    countries.map(country =>(
                    <MenuItem value={country.name}>{country.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              :
              <FormControl>
                <Select
                    variant='outlined'
                    onChange={onStateChange}
                    value={state}
                    renderValue={() => state}
                    style={{backgroundColor: 'white'}}
                  >
                  {
                    states.map(state =>(
                      statesLoc.hasOwnProperty(state.state) ? 
                      <MenuItem value={state.state}>{state.state}</MenuItem> : <></>
                    ))
                  }
                </Select>
              </FormControl>
            }
          </div>
        </div>
        <div className='app__stats'>
          <div style={{flex: 1}}>
            <InfoBox isRed active={casesType === 'cases'} onClick={e => setCasesType('cases')} title='Coranavirus cases' total={prettyPrintStat(countryInfo.cases)} cases={mode ? prettyPrintStat(stateInfo.positive) : prettyPrintStat(countryInfo.todayCases)} color="#CC1034" mode={mode}/>
          </div>
          <div style={{flex: 1}}>
            <InfoBox active={casesType === 'recovered'} onClick={e => setCasesType('recovered')} title='Recovered' total={prettyPrintStat(countryInfo.recovered)} cases={mode ? prettyPrintStat(stateInfo.recovered) : prettyPrintStat(countryInfo.todayRecovered)} color='#7dd71d' mode={mode}/>
          </div>
          <div style={{flex: 1}}>
            <InfoBox isRed active={casesType === 'deaths'} onClick={e => setCasesType('deaths')} title='Deaths' total={prettyPrintStat(countryInfo.deaths)} cases={mode ? prettyPrintStat(stateInfo.death) : prettyPrintStat(countryInfo.todayDeaths)} color='#fb4443' mode={mode}/>
          </div>
        </div>
        <Map
          countries={mapCountries} 
          center={mapCenter}
          zoom={mapZoom}
          casesType={casesType}
          mode={mode}
          state={stateInfo}
        />
      </div>
      <div className='app__right'>
        <Card className='app__rightCard'>
          <CardContent style={{flex: 1}}>
            <h3 className='app__graphTitle'>Live cases by country</h3>
            <Table countries={tableData}/>
            <h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
            <LineGraph className='app__graph' casesType={casesType}/>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
