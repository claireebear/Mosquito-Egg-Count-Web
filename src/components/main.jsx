import React from "react";
const Home = () => {
  return (
    <>
      <div className="hero border-1 pb-3">
        <div className="card bg-dark text-black border-0 mx-3">
          <img
            className="card-img img-fluid bg-white p-5"
            src="./assets/Team_Tab_BG.png"
            alt="Card"
            height={400}
          />
          <div className="card-img-overlay d-flex align-items-center">
            <div className="container">
              <h5 className="card-title fs-1 text fw-lighter">OpenCV Mosquito Egg Count Analyzer</h5>
              <p className="card-text fs-5 d-none d-sm-block ">
                - A mosquito egg count analyzer dedicated to the iGEM Competition
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
