import React, { useState, useEffect } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";

const Statistics = () => {
  const [stat, setStat] = useState({});
  useEffect(() => {
    try {
      (async () => {
        const res = await axios.get(
          "https://api.personality.jutopia.net/api/result"
        );
        if (res.data.length > 0) {
          const labels = [];
          const acc = [];
          for (let [key, value] of Object.entries(res.data[0])) {
            labels.push(key);
            acc.push(value);
          }
          setStat({
            labels: labels,
            acc: acc,
          });
        }
      })();
    } catch (err) {
      throw err;
    }
  }, []);
  var can = window.document.createElement("canvas");
  can.setAttribute("id", "canvas");
  window.document.getElementById("root").appendChild(can);
  var ctx = document.getElementById("canvas").getContext("2d");
  var gradient = ctx.createLinearGradient(500, 0, 100, 0);
  gradient.addColorStop(0, "#80b6f4");
  gradient.addColorStop(0.2, "#94d973");
  gradient.addColorStop(0.5, "#fad874");
  gradient.addColorStop(1, "#f49080");
  const colorArray = [
    "#f0efeb",
    "#cb997e",
    "#ddbea9",
    "#ffe8d6",
    "#b7b7a4",
    "#a5a58d",
    "#6b705c",
    "#B4D0D5",
    "#EACEC6",
    "#ECE2CC",
    "#B2B2B2",
    "#C2C4C4",
    "#D6D8D8",
    "#f4f1de",
    "#eee2df",
    "#b2f7ef",
  ];
  return (
    <>
      {stat.hasOwnProperty("labels") ? (
        <Doughnut
          data={{
            labels: stat.labels,
            datasets: [
              {
                labels: stat.labels,
                data: stat.acc,
                fill: false,
                backgroundColor: colorArray,
              },
            ],
          }}
          options={{
            animation: {
              duration: 1500,
            },
            legend: {
              display: true,
              position: "right",
            },
            tooltips: {
              callbacks: {
                label: (tooltipItem, data) => {
                  return data.datasets[0].labels[tooltipItem.index];
                },
                afterLabel: (tooltipItem, data) => {
                  var dataset = data.datasets[0];
                  var percent = Math.round(
                    (dataset["data"][tooltipItem["index"]] /
                      dataset["_meta"][0]["total"]) *
                      100
                  );
                  return "(" + percent + "%)";
                },
              },
            },
          }}
          height={100}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Statistics;
