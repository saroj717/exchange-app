import React, { Component } from 'react';
import Chart from 'chart.js';

import { json, checkStatus } from './utils';

class Exchange extends Component {
  constructor(props) {
    super(props)

    // const params = new URLSearchParams(props.location.search);
    // console.log(params.get('base'), params.get('quote'));

    this.state = {
      exchangerates: {},
      currencies: [],
      selectedBaseCurrency: 'USD',
      selectedExchangeCurrency: 'JPY',
      inputValue: 0,
      convertedAmount: 0,
      selectedDate: new Date().toISOString().slice(0, 10),
      loading: false,
      error: null
    }
    this.chartRef = React.createRef();

  }
  componentDidMount() {
    this.fetchCurrencies()
    // this.getRate(this.state.selectedBaseCurrency, this.state.selectedExchangeCurrency);

    this.getHistoricalRates(this.state.selectedBaseCurrency, this.state.selectedExchangeCurrency);

  }

  fetchCurrencies = () => {  
    fetch(`https://api.frankfurter.app/currencies`)
     .then(checkStatus)
     .then(json)
     .then((data) => {
        const currencies = Object.entries(data)
        console.log(currencies)
        this.setState({ currencies })
      })
     .catch((error) => {
        this.setState({ error: error.message })
        console.error('Error fetching currencies:', error)
      })
  }

  fetchConvertedAmount = () => {
    const host = 'api.frankfurter.app';
    const { inputValue, selectedBaseCurrency, selectedExchangeCurrency } = this.state;

    fetch(`https://${host}/latest?amount=${inputValue}&from=${selectedBaseCurrency}&to=${selectedExchangeCurrency}`)
    .then(resp => resp.json())
    .then((data) => {
      this.setState({ convertedAmount: data.rates[selectedExchangeCurrency] })
    });
    
  }

  handleselectedBaseCurrency = (e) => {
    this.setState({ selectedBaseCurrency: e.target.value })
    console.log(this.state.selectedBaseCurrency)
  }

  handleSelectExchangeCurrency = (event) => {
    this.setState({ selectedExchangeCurrency: event.target.value });
  };

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value });
  };


  getHistoricalRates = (base, quote) => {
    console.log
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date((new Date).getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=${base}&to=${quote}`)
      .then(checkStatus)
      .then(json)
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        const chartLabels = Object.keys(data.rates);
        const chartData = Object.values(data.rates).map(rate => rate[quote]);
        const chartLabel = `${base}/${quote}`;
        this.buildChart(chartLabels, chartData, chartLabel);
      })
      .catch(error => console.error(error.message));
  }
  buildChart = (labels, data, label) => {
    const chartRef = this.chartRef.current.getContext("2d");
    if (typeof this.chart !== "undefined") {
      this.chart.destroy();
    }
    this.chart = new Chart(this.chartRef.current.getContext("2d"), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: label,
            data,
            fill: false,
            tension: 0,
          }
        ]
      },
      options: {
        responsive: true,
      }
    })
  }

  

  render() {
    const { currencies, selectedBaseCurrency, selectedExchangeCurrency, inputValue, convertedAmount, selectedDate, error } = this.state;
    return (
      <div className="container bg-white border border-dark  border-2 rounded mt-2">
        <div className="row">
          <div className="col-md-6 mt-3 text-center">
            <div className="card bg-white text-white">
              <div className="card-body bg-secondary text-white rounded">
                <form action="">
                  <label htmlFor="">
                    Base Currency:
                    <select name="baseCurrency" id="baseCurrency" onChange={this.handleselectedBaseCurrency}>
                      <option key="0" value="0">Select Base Currency</option>
                      {this.state.currencies.map((currency) => (
                        <option key={currency} value={currency[0]}>{currency[0]} - {currency[1]}</option>
                      ))}
                    </select>
                  </label>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-6 mt-3 text-center">
            <div className="card bg-white text-white">
              <div className="card-body bg-secondary text-white rounded">
                <form action="">
                  <label htmlFor="">
                    Exchange Currency:
                    <select name="exchangeCurrency" id="exchangeCurrency" onChange={this.handleSelectExchangeCurrency} >
                      <option key="0" value="0">Select Exchange Currency</option>
                      {this.state.currencies.map((currency) => (
                        <option key={currency[0]} value={currency[0]}>{currency[0]} - {currency[1]}</option>
                        ))}
                    </select>
                  </label>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mt-3 text-center">
            <div className="card bg-white text-white">
              <div className="card-body bg-secondary text-white rounded">
                <form action="">
                  <label htmlFor="">
                    Amount:  
                  </label>
                  <br/>
                  <input type="number" name="amount" id="amount" placeholder='0' onChange={this.handleInputChange} />
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-6 mt-3 text-center">
            <div className="card bg-white text-white">
              <div className="card-body bg-secondary text-white rounded">
                <form action="">
                  <label htmlFor="">
                    Conversion Result:
                  </label>
                  <br/>
                  <input type="number" name="conversionResult" id="conversionResult" placeholder='0' value={this.state.convertedAmount} />
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 mt-5 mb-5 text-center">
            <button type="button" className="btn btn-danger" onClick={this.fetchConvertedAmount}>
              <b>Convert</b>
            </button>
          </div>
        </div>
        <div className='mb-3'>
          <h4 className='text-center text-white border border-dark rounded bg-secondary py-1'>Conversion Chart</h4>
          <canvas ref={this.chartRef} />
        </div>       
        <div className='text-center text-secondary'>
          <h6>Build by Saroj <span className='fs-5'>&middot;</span> Here is my link: 
          <a href="https://github.com/saroj717/exchange-app"><button className='btn btn-sm text-primary'><b>GitHub</b></button></a></h6>
        </div>
      </div>
    )
  }
}

export default Exchange