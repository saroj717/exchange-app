import React from 'react';
import { json, checkStatus } from './utils';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exchangerates: {},
      currencies: [],
      selectedBaseCurrency: 'USD',
      selectedExchangeCurrency: 'EUR',
      inputValue: 1,
      convertedAmount: null,
      selectedDate: new Date().toISOString().slice(0, 10),
      error: null
    };
  }

  componentDidMount() {
    this.fetchCurrencies();
    this.fetchExchangeRates();
  }

  fetchCurrencies = () => {
    fetch(`https://api.frankfurter.app/currencies`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        const currencies = Object.keys(data);
        this.setState({ currencies });
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.error('Error fetching currencies:', error);
      });
  };

  fetchExchangeRates = () => {
    const { selectedDate } = this.state;
    fetch(`https://api.frankfurter.app/${selectedDate}`)
      .then(checkStatus)
      .then(json)
      .then((data) => {
        this.setState({ exchangerates: data });
        this.calculateConvertedAmount();
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.error('Error fetching exchange rates:', error);
      });
  };

  handleSelectBaseCurrency = (event) => {
    this.setState({ selectedBaseCurrency: event.target.value }, this.calculateConvertedAmount);
  };

  handleSelectExchangeCurrency = (event) => {
    this.setState({ selectedExchangeCurrency: event.target.value }, this.calculateConvertedAmount);
  };

  handleInputChange = (event) => {
    this.setState({ inputValue: event.target.value }, this.calculateConvertedAmount);
  };

  handleDateChange = (event) => {
    this.setState({ selectedDate: event.target.value }, () => {
      this.fetchExchangeRates();
    });
  };

  calculateConvertedAmount = () => {
    const { exchangerates, selectedBaseCurrency, selectedExchangeCurrency, inputValue } = this.state;

    if (exchangerates && exchangerates.rates &&
        exchangerates.rates[selectedBaseCurrency] && exchangerates.rates[selectedExchangeCurrency]) {

      const baseRate = exchangerates.rates[selectedBaseCurrency];
      const exchangeRate = exchangerates.rates[selectedExchangeCurrency];
      console.log('Base Rate:', baseRate);
      console.log('Exchange Rate:', exchangeRate);
      const convertedAmount = (inputValue / baseRate) * exchangeRate;
      console.log('Converted Amount:', convertedAmount);

      this.setState({ convertedAmount });
    } else {
      this.setState({ convertedAmount: null });
    }
  };

  render() {
    const { currencies, selectedBaseCurrency, selectedExchangeCurrency, inputValue, convertedAmount, selectedDate, error } = this.state;

    return (
      <div className="container">
        {error && <div>Error: {error}</div>}
        <div className="row">
          <div className="col-md-6">
            <div className="card" id="baseCurrency">
              <div className="card-body">
                <form>
                  <label>
                    Select Base Currency:
                    <select value={selectedBaseCurrency} onChange={this.handleSelectBaseCurrency}>
                      {currencies.map((currency) => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </label>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card" id="exchangeCurrency">
              <div className="card-body">
                <form>
                  <label>
                    Select Exchange Currency:
                    <select value={selectedExchangeCurrency} onChange={this.handleSelectExchangeCurrency}>
                      {currencies.map((currency) => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </label>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="card" id="amount">
              <div className="card-body">
                <form>
                  <label>
                    Enter Amount:
                    <input type="number" value={inputValue} onChange={this.handleInputChange} />
                  </label>
                </form>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card" id="conversionResult">
              <div className="card-body">
                <p>Converted Amount: {convertedAmount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 text-center">
            <div className="card" id="datePicker">
              <div className="card-body">
                <form>
                  <label>
                    Select Date:
                    <input type="date" value={selectedDate} onChange={this.handleDateChange} />
                  </label>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
