import React, { Component } from 'react'
import Chart from './Chart'
import Bar from './Bar'
import logo from './images/logo.svg'
import './css/react-vis.css'

const API_URL = "https://1kfs7evxca.execute-api.eu-west-1.amazonaws.com/beta/grants"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      issue: [],
      location: [],
    }
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
        this.setState({
          issue: response.data.facets.issue,
          location: response.data.facets.country_name
        })
      }
  )}

  render() {
    const {issue, location} = this.state
    const chartDataProjects = [
      {theta: 3.2, color: 'rgb(239, 93, 40)', label: 'International', subLabel: '32%'},
      {theta: 6.8, color: 'rgb(255, 152, 51)', label: 'United Kingdom', subLabel: '68%'}
    ]
    const chartDataAwarded = [
      {theta: 7.6, color: 'rgb(25, 205, 215)', label: 'International', subLabel: '76%'},
      {theta: 2.4, color: 'rgb(30, 150, 190)', label: 'United Kingdom', subLabel: '24%'}
    ]
    const barData = [
            {x: 'Better Futures', y: 97},
            {x: 'Safer lives', y: 94},
            {x: 'Building stronger communities', y: 63},
            {x: 'Improving health and wellbeing', y: 56},
            {x: 'Investing in children and young people', y: 51},
            {x: 'Healthier finances', y: 49},
            {x: 'Fairer society', y: 42},
            {x: 'Women and Girls', y: 35},
            {x: 'Empowering women and girls', y: 34},
            {x: 'Trade, enterprise and employment', y: 33},
            {x: 'Education', y: 31},
            {x: 'Children and young people at risk', y: 29},
            {x: 'UK - Local communities', y: 24},
            {x: 'Slum dwellers', y: 21},
            {x: 'Health', y: 19},
            {x: 'People affected by HIV', y: 14},
            {x: 'Sport for Change', y: 10},
            {x: 'Stronger communities', y: 3},
            {x: 'Common Ground Initiative', y: 1},
            {x: 'None of the above', y: 1},
            {x: 'Sexual abuse or exploitation', y: 1}
    ]
    return (
      <main>
        <div className="grid intro">
          <img src={logo} className="app-logo" alt="logo" />
          <h1>Grants Open Data</h1><br />
          <h2>demo</h2>
        </div>
        <div className="grid facts-1">
          <h2>Awarded<br/>
            <span className="number">
              {Math.trunc((issue.map(a => a.total_awarded).reduce((a, b) => a + b, 0))/1000000)}
            </span>+ million
          </h2>
        </div>
        <div className="grid facts-2">
          <h2>
            <span className="number">
              {issue.map(a => a.count).reduce((a, b) => a + b, 0)}
            </span><br/>active projects
          </h2>
        </div>
        <div className="grid facts-3">
          <h2>
            <span className="number">
              {issue.length}
            </span> categories
          </h2>
        </div>
        <div className="grid facts-4">
          <h2>Over&nbsp
            <span className="number">
              {location.length}
            </span> countries in the world!
          </h2>
        </div>
        <div className="grid bar">
          <Bar barData={barData}/>
        </div>
        <div className="grid chart-1">
          <Chart chartData={chartDataProjects}/>
          <p>Percentage of active projects</p>
        </div>
        <div className="grid chart-2">
          <Chart chartData={chartDataAwarded} innerRadius='80'/>
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
