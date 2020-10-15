import React, { useEffect } from "react";
import axios from "axios";

const Result = ({ answer, calcResult, refreshPage, startTest }) => {
  const TYPE = calcResult();

  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const data = {
      response: answer,
      category: TYPE,
    };
    async function post() {
      axios.post(
        "https://api.personality.jutopia.net/api/result",
        data,
        config
      );
    }
    post();
  }, [TYPE, answer]);

  return (
    <>
      <div className="result-main"></div>
      {TYPE}
      <div className="control"></div>
      <button onClick={(e) => refreshPage()}>처음으로</button>
      <button onClick={(e) => startTest()}>다시하기</button>
      <div className="share"></div>
    </>
    //SNS로 공유하기
  );
};

Result.propTypes = {
  //solid constructure
};

export default Result;
