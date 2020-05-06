import React, { Component } from "react";
import "./App.css";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import Card from "./component/cards";

class App extends Component {
  state = {
    data: {},
    date: [],
    chartData: {},
    chartDayData: {},
    country: {},
    act: "",
    selectedOption: {},
  };

  async componentWillMount() {
    await this.getChartData("hungary");
  }
  formData(data) {
    return data.map((e) => e.split("T")[0]);
  }
  getDay(data) {
    let a = [];
    for (let i = 0; i < data.length; i++) {
      a[i] = data[i + 1] - data[i];
    }
    a = a.splice(a.length - 30, a.length);
    return a;
  }
  getActives(b, c, d) {
    let a = [];
    for (let i = 0; i < b.length; i++) {
      a[i] = b[i] - (c[i] + d[i]);
    }
    return a;
  }

  getChartData = async (c) => {
    await this.setState({ act: c.charAt(0).toUpperCase() + c.slice(1) });
    //https://api.covid19api.com/dayone/country/hungary
    let res = await axios.get(
      "https://api.covid19api.com/total/dayone/country/" + c
    );
    let country = await axios.get("https://api.covid19api.com/countries");
    country = country.data.map((e) => e.Country);
    country.sort();
    country = country.map((e, i) => ({ value: i, label: e }));
    this.setState({ country: country });
    let Confirmed = await res.data.map((e) => e.Confirmed);
    let Recovered = await res.data.map((e) => e.Recovered);
    let Deaths = await res.data.map((e) => e.Deaths);
    let Date = this.formData(res.data.map((e) => e.Date));
    let Actives = this.getActives(Confirmed, Recovered, Deaths);

    let DayDeaths = this.getDay(res.data.map((e) => e.Deaths));
    let DayConfirmed = this.getDay(res.data.map((e) => e.Confirmed));
    let DayRecovered = this.getDay(res.data.map((e) => e.Recovered));
    let DayDate = this.formData(res.data.map((e) => e.Date));

    DayDate = DayDate.splice(DayDate.length - 29, 29);
    DayDate.push(" ");

    let lastConfirmed = Confirmed[Confirmed.length - 1];
    let lastRecovered = Recovered[Recovered.length - 1];
    let lastDeaths = Deaths[Deaths.length - 1];
    let lastActives = Actives[Actives.length - 1];

    /*  DayConfirmed.pop();
    DayDeaths.pop();
    DayRecovered.pop(); */

    this.setState({
      data: { lastConfirmed, lastRecovered, lastDeaths, lastActives },
    });
    this.setState({
      chartData: {
        labels: Date,
        datasets: [
          {
            label: "Cases",
            type: "line",
            data: Confirmed,
            fill: false,
            borderColor: ["rgba(54, 162, 235, 1)"],
          },
          {
            label: "Deads",
            type: "line",
            data: Deaths,
            fill: false,
            borderColor: "#e74a3b",
          },
          {
            label: "Recovered",
            type: "line",
            data: Recovered,
            fill: false,
            borderColor: ["#1cc88a"],
          },
          {
            label: "Actives",
            type: "line",
            data: Actives,
            fill: false,
            borderColor: "rgb(246,194,61,1)",
          },
        ],
      },
      chartDayData: {
        labels: DayDate,
        datasets: [
          {
            label: "New dead",
            type: "bar",
            fill: false,
            data: DayDeaths,
            borderColor: "rgb(231,74,59,1)",
            backgroundColor: "rgb(231,74,59,0.5)",
            borderWidth: 1,
          },
          {
            label: "New recover",
            type: "bar",
            fill: false,
            data: DayRecovered,
            borderColor: "rgb(28,200,138,1)",
            backgroundColor: "rgb(28,200,138,0.5)",
            borderWidth: 1,
          },
          {
            label: "New case",
            type: "bar",
            fill: false,
            data: DayConfirmed,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgb(54, 162, 235,0.5)",
            borderWidth: 1,
          },
        ],
      },
      chartCase: {
        labels: Date,
        datasets: [],
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
          <div className="m-3 mt-4">
            <Select
              className=""
              value={selectedOption}
              onChange={this.handleChange}
              options={this.state.country}
            />
          </div>
          <Card data={this.state.data}></Card>
        </div>
        <div className="ml-1 mr-3 mb-5" style={{ height: "60vh" }}>
          <div className="mb-n5 h5">
            Covid-19 cases recover and deaths in {this.state.act}
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
