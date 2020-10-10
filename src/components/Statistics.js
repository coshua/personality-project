import React, { useState, useEffect } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import Amplify, { API } from "aws-amplify";
import aws_exports from "../aws-exports";
Amplify.configure(aws_exports);
const Statistics = () => {
  const [stat, setStat] = useState({});
  useEffect(() => {
    try {
      (async () => {
        const res = await API.get("amptool", "/items/result");
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
                fill: true,
              },
            ],
          }}
          options={{
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
        <>loading</>
      )}
    </>
  );
};

export default Statistics;
