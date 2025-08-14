import React, { useEffect, useState } from "react";
import axios from "axios";
import Plot from "react-plotly.js";

function Dashboard() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [intradayData, setIntradayData] = useState([]);
  const [graph, setGraph] = useState(true);
  const [fetchedCompanies, setFetchedCompanies] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND}/companies`)
      .then((res) => {
        setCompanies(res.data);
        setFetchedCompanies(true);
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchIntraday = (ticker) => {
    if (!ticker) return; // prevent empty requests
    setGraph(false);
    axios
      .get(
        `${import.meta.env.VITE_BACKEND}/companies-intraday?tickers=${ticker}&interval=5m`
      )
      .then((res) => {
        const companyData = res.data.find((c) => c.ticker === ticker);
        setSelectedCompany(companyData);
        setIntradayData(companyData.intraday_data);
        setGraph(true);
      })
      .catch((err) => console.error(err));
  };

  const plotData = selectedCompany
    ? [
        {
          x: intradayData.map((d) => d.Datetime),
          open: intradayData.map((d) => d.Open),
          high: intradayData.map((d) => d.High),
          low: intradayData.map((d) => d.Low),
          close: intradayData.map((d) => d.Close),
          type: "candlestick",
          name: selectedCompany.company_name,
        },
      ]
    : [];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Companies</h2>
        <p className="text-gray-300">
          {companies.length === 0 &&
            !fetchedCompanies &&
            "Fetching Companies..."}
        </p>
        <ul className="flex-1 overflow-y-auto">
          {companies.map((c) => (
            <li
              key={c.ticker}
              onClick={() => fetchIntraday(c.ticker)}
              className="cursor-pointer p-2 rounded hover:bg-gray-700 mb-1"
            >
              {c.company_name} ({c.ticker})
            </li>
          ))}
        </ul>
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-6 overflow-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Stock Market Dashboard
          </h1>
        </header>

        {selectedCompany && graph ? (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">
              {selectedCompany.company_name} - Intraday Chart
            </h2>

            <Plot
              data={plotData}
              layout={{
                width: 1100,
                height: 500,
                title: selectedCompany.company_name,
              }}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div className="bg-gray-100 p-4 rounded shadow">
                <p className="font-semibold">Open</p>
                <p>{selectedCompany.today_open}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded shadow">
                <p className="font-semibold">High</p>
                <p>{selectedCompany.today_high}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded shadow">
                <p className="font-semibold">Low</p>
                <p>{selectedCompany.today_low}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded shadow">
                <p className="font-semibold">Close</p>
                <p>{selectedCompany.today_close}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded shadow">
                <p className="font-semibold">52W High</p>
                <p>{selectedCompany["52_week_high"]}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded shadow">
                <p className="font-semibold">52W Low</p>
                <p>{selectedCompany["52_week_low"]}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded shadow">
                <p className="font-semibold">Avg Volume</p>
                <p>{selectedCompany.average_volume}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 mt-6">
            {graph
              ? "Select a company to view the intraday graph"
              : "Fetching Data..."}
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
