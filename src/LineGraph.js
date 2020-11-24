import React, {useState, useEffect} from 'react'
import { Line } from 'react-chartjs-2'
import numeral from 'numeral'
import './LineGraph.css'

const options = {
    legend: {
        display: false,
    },
    elements: {
        point:{
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            label : function(tooltipItem, data){
                return numeral(tooltipItem.value).format('+0.0');
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: 'time',
                time: {
                    format: 'MM/DD/YY',
                    tooltipFormat: 'll'
                }
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false
                },
                ticks: {
                    callback: function (value, index, values){
                        return numeral(value).format('0a')
                    },
                },
            },
        ],

    },
};

function LineGraph({casesType = 'cases', ...props}) {
    const [data, setData] = useState({})

    const buildChartData = (data, casesType = 'cases') =>{
        const chartData = [];
        let lastDataPoint;

        for(let date in data.cases){
            if(lastDataPoint){
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint)
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData
    }
    useEffect(() => {
        const fetchData = async () =>{
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then(response => response.json())
            .then(data => {
                const chartData = buildChartData(data, casesType);
                setData(chartData)
            })
        }
        fetchData();
    }, [casesType])
    return (
        <div className={props.className}>
            <div className={props.className}>
                {
                    data?.length > 0 && 
                    <Line
                        className='graph' 
                        data={{
                            datasets: [
                                {
                                    data: data,
                                    backgroundColor: casesType === 'cases' ? "rgba(204, 16, 52, 0.5)" : casesType === 'recovered' ? 'rgba(125, 215, 29, 0.5)' : 'rgba(251, 68, 67, 0.5)',
                                    borderColor: casesType === 'cases' ? "#CC1034" : casesType === 'recovered' ? '#7dd71d' : '#fb4443'
                                }],
                        }} 
                        options={options}
                    />
                }
            </div>
        </div>
    )
}

export default LineGraph
