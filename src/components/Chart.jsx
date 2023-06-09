import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import countries from "../countries";

const LineChart = (props) => {
    const [chartData, setChartData] = useState({
        options: {
            chart: {
                id: "basic-line",
            },
            xaxis: {
                categories: [],
            },
            legend: {
                show: true,
                position: "top",
                horizontalAlign: "center",
                labels: {
                    colors: "#333",
                    useSeriesColors: true,
                },
            },
            yaxis: {
                min: 0,
                labels: {
                    formatter: function (val) {
                        if (val >= 1) {
                            const formattedVal =
                                Math.round(val).toLocaleString();
                            return formattedVal;
                        } else if (val === 0) {
                            return val;
                        } else {
                            const invertedVal = Math.round(1 / val);
                            return `1 in ${invertedVal} people`;
                        }
                    },
                },
            },
        },
        series: [
            {
                name: "New Cases",
                data: [],
            },
        ],
    });

    useEffect(() => {
        console.log("chart render");
        setChartData({
            options: {
                xaxis: {
                    categories: [],
                },
            },
            series: [],
        });
        const countryNames = [];
        const series = [];

        for (let i = 0; i < props.countriesData.length; i++) {
            const data = props.countriesData[i];
            const country = data.Country;

            if (!countryNames.some((obj) => obj.Country === country)) {
                const populationObj = countries.find(
                    (obj) => obj.Country === country
                );

                const dataObj = {
                    Country: country,
                    Population: populationObj.population,
                };

                countryNames.push(dataObj);

                const newData = { name: country, data: [] };
                series.push(newData);
            }

            if (props.capitaState === true) {
                for (let j = 0; j < series.length; j++) {
                    if (series[j].name === country) {
                        // find the population value in the countryNames array that matches the current country
                        const population = countryNames.find(
                            (obj) => obj.Country === country
                        ).Population;
                        if (population !== 0 && population !== undefined) {
                            series[j].data.push(data.New / population);
                        } else {
                            series[j].data.push(0);
                        }
                        break;
                    }
                }
            } else if (props.capitaState === false) {
                for (let j = 0; j < series.length; j++) {
                    if (series[j].name === country) {
                        series[j].data.push(data.New);
                        break;
                    }
                }
            }
        }

        const categories = props.countriesData.map((data) => data.Date);

        setChartData({
            options: {
                xaxis: {
                    categories: categories,
                },
                title: {
                    text: props.capitaState
                        ? "Daily New Cases (Per Capita)"
                        : "Daily New Cases",
                    align: "left",
                    style: {
                        fontSize: "20px",
                    },
                },
            },
            series: series,
        });
    }, [props.countriesData, props.capitaState, props.selectedCountries]);

    return (
        <div>
            <Chart
                options={chartData.options}
                series={chartData.series}
                type="line"
                width={1100}
            />
        </div>
    );
};

export default LineChart;
