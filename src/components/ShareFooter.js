import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Toast from "light-toast";
import PropTypes from "prop-types";
import length from "../App";

const Span = styled.span`
  flex: 1;
  margin: 1rem auto;
  display: flex;
  width: 80%;
  align-items: center;
  justify-content: space-around;
  @media only screen and (min-width: 600px) {
    width: 20%;
    font-size: 2vw;
  }
`;

function ShareFooter({ index, music, muteMusic, unmuteMusic }) {
  return (
    <Span>
      {!music.pause ? (
        <i className="fas fa-headphones fa-lg" onClick={muteMusic}></i>
      ) : (
        <i className="fas fa-volume-mute fa-lg" onClick={unmuteMusic}></i>
      )}
      {index === 0 || index === length ? (
        <>
          <img
            src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"
            alt="share"
            onClick={(e) =>
              window.Kakao.Link.sendCustom({
                templateId: 36312,
                templateArgs: {
                  image_url:
                    "https://personality.jutopia.net/images/flowers.jpg",
                },
              })
            }
          />
          <div
            className="fb-share-button"
            data-href="https://personality.jutopia.net"
            data-layout="button_count"
            data-size="large"
          >
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fpersonality.jutopia.net%2F&amp;src=sdkpreparse"
              className="fb-xfbml-parse-ignore"
            >
              Share
            </a>
          </div>

          <i
            className="fas fa-link"
            onClick={() => {
              navigator.clipboard.writeText("personality.jutopia.net");
              Toast.info("Copied to Clipboard", 2000);
            }}
          ></i>
        </>
      ) : (
        <></>
      )}
      <Link to="/post">post</Link>
      <Link to="/statistics">stat</Link>
    </Span>
  );
}

ShareFooter.propTypes = {
  music: PropTypes.object,
};

export default React.memo(ShareFooter);
