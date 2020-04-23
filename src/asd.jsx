import React, { Component } from "react";
import "./App.css";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { NativeSelect } from "@material-ui/core";
import Select from "react-select";

class App extends Component {
  state = {
    chartData: {},
    chartDayData: {},
    country: {},
    act: "",
    selectedOption: {},
  };

  async componentWillMount() {
    this.getChartData("hungary");
  }
  formData(data) {
    return data.map((e) => e.split("T")[0]);
  }
  getDayByConfirmed(data) {
    let a = [];
    for (let i = 0; i < data.length; i++) {
      a[i + 1] = data[i + 1] - data[i];
    }
    return a;
  }
  getDayByDeaths(data) {
    let a = [];
    for (let i = 0; i < data.length; i++) {
      a[i + 1] = data[i + 1] - data[i];
    }
    return a;
  }

  getChartData = async (c) => {
    this.setState({ act: c.charAt(0).toUpperCase() + c.slice(1) });
    //https://api.covid19api.com/dayone/country/hungary
    let res = await axios.get(
      "https://api.covid19api.com/total/dayone/country/" + c
    );
    let country = await axios.get("https://api.covid19api.com/countries");
    country = country.data.map((e) => e.Country);
    country.sort();
    country = country.map((e, i) => ({ value: i, label: e }));
    this.setState({ country: country });
    let Confirmed = res.data.map((e) => e.Confirmed);
    let Date = this.formData(res.data.map((e) => e.Date));
    let DayDate = this.formData(res.data.map((e) => e.Date));
    let Deaths = res.data.map((e) => e.Deaths);
    let DayConfirmed = this.getDayByConfirmed(res.data.map((e) => e.Confirmed));
    let DayDeaths = this.getDayByDeaths(res.data.map((e) => e.Deaths));
    DayConfirmed.pop();
    DayDeaths.pop();
    this.setState({
      chartData: {
        labels: Date,
        datasets: [
          {
            label: "Deads",
            type: "line",
            data: Deaths,
            fill: false,
            borderColor: "rgba(255,99,132,1)",
          },
          {
            label: "Cases",
            type: "line",
            data: Confirmed,
            fill: false,
            borderColor: ["rgba(54, 162, 235, 1)"],
          },
        ],
      },
      chartDayData: {
        labels: DayDate,
        datasets: [
          {
            label: "New dead",
            type: "line",
            fill: false,
            data: DayDeaths,
            borderColor: "rgba(255,99,132,1)",
          },
          {
            label: "New case",
            type: "line",
            fill: false,
            data: DayConfirmed,
            borderColor: "rgba(54, 162, 235, 1)",
          },
        ],
      },
    });
  };
  handleChange = (selectedOption) => {
    this.getChartData(selectedOption.label);
    this.setState({ selectedOption });
  };

  render() {
    const { selectedOption } = this.state.selectedOption;
    return (
      <div className="App">
        <div style={{ width: "80vw" }} className="mx-auto">
          <div className="mt-3">
            <Select
              value={selectedOption}
              onChange={this.handleChange}
              options={this.state.country}
            />
          </div>

          {/* <NativeSelect
            className="form-control mt-4"
            defaultValue=""
            onChange={(e) => this.handleChange(e.target.value)}
          >
            <option value="">Hungary</option>
            {this.state.country.map((e, i) => (
              <option key={i} value={e}>
                {e}
              </option>
            ))}
          </NativeSelect> */}
        </div>
        <div className="ml-1 mr-3 mb-5" style={{ height: "60vh" }}>
          <div className="mb-n5 h5">
            Covid-19 cases and deaths in {this.state.act}
          </div>
          <div className="mt-n5" style={{ height: "60vh" }}>
            <Line
              data={this.state.chartData}
              options={{
                maintainAspectRatio: false,
                responsive: true,
                title: {
                  display: true,
                  fontSize: 25,
                },
                legend: {
                  display: true,
                },
              }}
            />
          </div>
        </div>
        <div className="ml-1 mr-3 mb-5" style={{ height: "60vh" }}>
          <div className="mb-n5 h5">
            Covid-19 cases and deaths in {this.state.act}
          </div>
          <div className="mt-n5" style={{ height: "60vh" }}>
            <Line
              data={this.state.chartDayData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                title: {
                  display: true,
                  fontSize: 25,
                },
                legend: {
                  display: true,
                },
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
