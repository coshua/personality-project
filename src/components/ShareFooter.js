import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Toast from "light-toast";
import PropTypes from "prop-types";
const Span = styled.span`
  flex: 1;
  margin: 1rem auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 25%;
  font-size: 2.6vw;
  @media only screen and (min-width: 600px) {
    width: 20%;
    font-size: 2vw;
  }
`;

function ShareFooter({ music, muteMusic, unmuteMusic }) {
  return (
    <Span>
      {!music.pause ? (
        <i className="fas fa-headphones fa-lg" onClick={muteMusic}></i>
      ) : (
        <i className="fas fa-volume-mute fa-lg" onClick={unmuteMusic}></i>
      )}
      <img
        src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"
        alt="share"
        onClick={(e) =>
          window.Kakao.Link.sendCustom({
            templateId: 36312,
            templateArgs: {
              image_url:
                "https://myanimal.kokkiri.kr/assets/img/promotion/img_character14@2x.png",
            },
          })
        }
      />
      <i
        className="fas fa-link"
        onClick={() => {
          navigator.clipboard.writeText("personality.jutopia.net");
          Toast.info("Copied to Clipboard", 2000);
        }}
      ></i>
      <Link to="/post">post</Link>
      <Link to="/statistics">stat</Link>
    </Span>
  );
}

ShareFooter.propTypes = {
  music: PropTypes.object,
};

export default React.memo(ShareFooter);
