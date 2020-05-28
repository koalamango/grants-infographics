import React, { Component } from 'react'
import Chart from './Chart'
import Bar from './Bar'
import logo from './images/logo.svg'
import RandomColor from 'randomcolor'

const API_URL = "https://grants.sls.comicrelief.com/public/grants"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      awarded: 0,
      awardedTotal: 0,
      category: 0,
      chartData1: [],
      chartData2: [],
      country: 0,
      projects: 0,
      projectsTotal: 0,
      barData: [],
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

        let barData = [], chartData1 = [], chartData2 = [], category = [], country = [],
            projectUK = 0, awardedUK = 0, awardedTotal = 0, catData = {}

        const grantData = response.data.grants;
        const projectTotal = response.data.pagination.total

        // Process data
        grantData.map(data => {
          awardedTotal = awardedTotal + data.amount
          if (data.partyCountryName === 'United Kingdom') {
            projectUK++;
            awardedUK = awardedUK + data.amount
          }
          if (data.partyCountryName && !country.includes(data.partyCountryName)) {
            country.push(data.partyCountryName)
          }
          if (data.applicationScheme && !category.includes(data.applicationScheme)) {
            category.push(data.applicationScheme)
            catData[data.applicationScheme] = 0
          } else {
            catData[data.applicationScheme]++
          }
          return { awardedTotal, awardedUK, category, country, projectUK }
        })

        // Prepare the chart/bar|
        const projects = Math.trunc((projectUK/projectTotal*100))
        const awarded = Math.trunc(awardedUK/awardedTotal*100)

        chartData1.push(
          { theta: projects/10, color: RandomColor({hue: 'blue',luminosity: 'light'})},
          { theta: 10 - projects/10, color: RandomColor({hue: 'purple',luminosity: 'light'})}
        )

        chartData2.push(
          { theta: awarded/10, color: RandomColor({hue: 'red',luminosity: 'light'})},
          { theta: 10 - awarded/10, color: RandomColor({hue: 'orange',luminosity: 'light'})}
        )

        Object.keys(catData).map((key, value) => {
          barData.push({ x: key, y: value})
          return barData
        })

        this.setState({
          awarded: awarded,
          awardedTotal: awardedTotal,
          category: category.length,
          chartData1: chartData1,
          chartData2: chartData2,
          country: country.length,
          projects: projects,
          projectTotal: projectTotal,
          barData: barData,
        })
      }
  )}

  render() {
    const { awarded, awardedTotal, barData, category, chartData1, chartData2, country, projects, projectTotal } = this.state

    return (
      <main>
        <div className="grid intro">
          <img src={logo} className="app-logo" alt="logo" />
          <h1>Grants Open Data</h1><br />
          <h2>demo</h2>
        </div>
        <div className="grid facts-1">
          <h2>
            Awarded<br/><span>{Math.trunc(awardedTotal/1000000)}</span>+ millions
          </h2>
        </div>
        <div className="grid facts-2">
          <h2>
            <span>{projectTotal}</span><br/>active projects
          </h2>
        </div>
        <div className="grid facts-3">
          <h2>
            <span>{category}</span> schemes
          </h2>
        </div>
        <div className="grid facts-4">
          <h2>
            Over <span>{country}</span> countries in the world!
          </h2>
        </div>
        <div className="grid bar">
          <Bar barData={barData}/>
        </div>
        <div className="grid chart-1">
          <Chart chartData={chartData1}/>
          <p>
            Percentage of active projects<br/>
            UK: {projects}% , International: {100 - projects}%
          </p>
        </div>
        <div className="grid chart-2">
          <Chart chartData={chartData2} innerRadius='80'/>
          <p>
            Percentage of amount awarded<br/>
            UK: {awarded}% , International: {100 - awarded}%
          </p>
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
