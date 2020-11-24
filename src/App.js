import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import LineGraph from './LineGraph'
import './App.css';
import { sortData } from './util'
import 'leaflet/dist/leaflet.css'
import {prettyPrintStat} from './util'

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('Worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [circles, setCircles] = useState(0)
  const [casesType, setCasesType] = useState('cases')

  useEffect(() => {
    fetch('https:/disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
    setCircles(1)
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

  return (
    <div className="app">
      <div className='app__left'>
        <div className='app__header'>
          <h1>COVID-19 Tracker</h1>
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
        </div>
        <div className='app__stats'>
          <div style={{flex: 1}}>
            <InfoBox isRed active={casesType === 'cases'} onClick={e => setCasesType('cases')} title='Coranavirus cases' total={prettyPrintStat(countryInfo.cases)} cases={prettyPrintStat(countryInfo.todayCases)} color="#CC1034"/>
          </div>
          <div style={{flex: 1}}>
            <InfoBox active={casesType === 'recovered'} onClick={e => setCasesType('recovered')} title='Recovered' total={prettyPrintStat(countryInfo.recovered)} cases={prettyPrintStat(countryInfo.todayRecovered)} color='#7dd71d'/>
          </div>
          <div style={{flex: 1}}>
            <InfoBox isRed active={casesType === 'deaths'} onClick={e => setCasesType('deaths')} title='Deaths' total={prettyPrintStat(countryInfo.deaths)} cases={prettyPrintStat(countryInfo.todayDeaths)} color='#fb4443'/>
          </div>
        </div>
        <Map
          countries={mapCountries} 
          center={mapCenter}
          zoom={mapZoom}
          circles={circles}
          casesType={casesType}
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
