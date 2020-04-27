import React, { Component } from "react";

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="mb-5">
        <div className="container"></div>
        <div className="row">
          <div className="col-sm-12 col-lg-4 my-2">
            <div
              className="card shadow mx-auto border-left-info"
              style={{ width: "18rem" }}
            >
              <div className="card-body">
                <h5 className="card-title text-muted">Infected</h5>
                <h6 className="card-subtitle mb-2 h5">
                  {this.props.data.lastConfirmed}
                </h6>
                <p className="card-text">Number of active cases of COVID-19.</p>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-lg-4 my-2 ">
            <div
              className="card mx-auto shadow border-left-success "
              style={{ width: "18rem" }}
            >
              <div className="card-body">
                <h5 className="card-title text-muted">Recovered</h5>
                <h6 className="card-subtitle mb-2 h5 ">
                  {this.props.data.lastRecovered}
                </h6>
                <p className="card-text">Number of recoveries from COVID-19.</p>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-lg-4 my-2">
            <div
              className="card shadow mx-auto border-left-danger"
              style={{ width: "18rem" }}
            >
              <div className="card-body">
                <h5 className="card-title text-muted">Deaths</h5>
                <h6 className="card-subtitle mb-2 h5">
                  {this.props.data.lastDeaths}
                </h6>
                <p className="card-text">
                  Number of deaths caused by COVID-19.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
