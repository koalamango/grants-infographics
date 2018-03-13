import React, { Component } from 'react'
import Chart from './Chart'
import Bar from './Bar'
import logo from './images/logo.svg'
import './css/react-vis.css'
import RandomColor from 'randomcolor'

const API_URL = "https://1kfs7evxca.execute-api.eu-west-1.amazonaws.com/beta/grants"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      issue: [],
      location: [],
      awarded: '',
      projects: '',
      barData: [],
      chartData1: [],
      chartData2: [],
    }
  }

  sum(data){
    // Todo: add map function (filter by property name)
    const processed = data.reduce((a, b) => a + b, 0)
    return processed
  }

  componentDidMount() {
    fetch(API_URL)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        else {
          throw new Error ('something went wrong')
        }
      })
      .then(response => {
        const grantData = response.data.facets;
        const awardedTotal = this.sum(grantData.issue.map(a => a.total_awarded))
        const projectTotal = this.sum(grantData.issue.map(a => a.count))
        let barData = [], chartData1 = [], chartData2 = []

        grantData.issue.map(data => {
          barData.push({ x: data.key, y: data.count})
          return barData
        })

        grantData.country_name.filter((r)=> {return r.key === 'UNITED KINGDOM'}).map(data =>{

          const projects = Math.trunc((data.count/projectTotal*100))
          const awarded = Math.trunc(data.total_awarded/awardedTotal*100)

          chartData1.push(
            { theta: projects/10, color: RandomColor({hue: 'blue',luminosity: 'light'}), label: 'United Kingdom', subLabel: projects + '%'},
            { theta: 10 - projects/10, color: RandomColor({hue: 'purple',luminosity: 'light'}), label: 'International', subLabel: 100 - projects + '%'}
          )

          chartData2.push(
            { theta: awarded/10, color: RandomColor({hue: 'red',luminosity: 'light'}), label: 'United Kingdom', subLabel: awarded + '%'},
            { theta: 10 - awarded/10, color: RandomColor({hue: 'orange',luminosity: 'light'}), label: 'International', subLabel: 100 - awarded + '%'}
          )

          return { chartData1, chartData2 }
        })

        this.setState({
          issue: grantData.issue,
          location: grantData.country_name,
          awarded: awardedTotal,
          projects: projectTotal,
          barData: barData,
          chartData1: chartData1,
          chartData2: chartData2,
        })
      }
  )}

  render() {
    const { issue, location, barData, awarded, projects, chartData1, chartData2 } = this.state

    return (
      <main>
        <div className="grid intro">
          <img src={logo} className="app-logo" alt="logo" />
          <h1>Grants Open Data</h1><br />
          <h2>demo</h2>
        </div>
        <div className="grid facts-1">
          <h2>
            Awarded<br/><span>{Math.trunc(awarded/1000000)}</span>+ millions
          </h2>
        </div>
        <div className="grid facts-2">
          <h2>
            <span>{projects}</span><br/>active projects
          </h2>
        </div>
        <div className="grid facts-3">
          <h2>
            <span> {issue.length}</span> categories
          </h2>
        </div>
        <div className="grid facts-4">
          <h2>
            Over <span>{location.length}</span> countries in the world!
          </h2>
        </div>
        <div className="grid bar">
          <Bar barData={barData}/>
        </div>
        <div className="grid chart-1">
          <Chart chartData={chartData1}/>
          <p>Percentage of active projects</p>
        </div>
        <div className="grid chart-2">
          <Chart chartData={chartData2} innerRadius='80'/>
          <p>Percentage of amount awarded</p>
        </div>
        <div className="grid footer">
          <a href="https://grants-infographics-demo.netlify.com/">Home</a> |
          <a href="https://github.com/KoalaMango/grants-infographics" target="_blank" rel="noopener noreferrer">Github</a> |
          Author: Jessie Wang
        </div>
      </main>
    )
  }
}

export default App
