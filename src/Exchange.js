import React, { Component } from 'react';
import { json, checkStatus } from './utils';

class Exchange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      exchangerates: {},
      currencies: [],
      selectedBaseCurrency: '',
      selectedExchangeCurrency: '',
      inputValue: 0,
      convertedAmount: 0,
      selectedDate: new Date().toISOString().slice(0, 10),
      error: null
    }
  }
  componentDidMount() {
    this.fetchCurrencies()
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

  

  render() {
    const { currencies, selectedBaseCurrency, selectedExchangeCurrency, inputValue, convertedAmount, selectedDate, error } = this.state;
    return (
      <div className="container bg-info border-body">
        <div className="row">
          <div className="col-md-6 mt-3 text-center">
            <div className="card bg-white text-white">
              <div className="card-body bg-secondary text-white">
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
              <div className="card-body bg-secondary text-white">
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
              <div className="card-body bg-secondary text-white">
                <form action="">
                  <label htmlFor="">
                    Amount:  
                  </label>
                  <input type="number" name="amount" id="amount" placeholder='0' onChange={this.handleInputChange} />
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-6 mt-3 text-center">
            <div className="card bg-white text-white">
              <div className="card-body bg-secondary text-white">
                <form action="">
                  <label htmlFor="">
                    Conversion Result:
                  </label>
                  <input type="number" name="conversionResult" id="conversionResult" placeholder='0' value={this.state.convertedAmount} />
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 mt-5 mb-3 text-center">
            <button type="button" className="btn btn-danger" onClick={this.fetchConvertedAmount}>
              Convert
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Exchange