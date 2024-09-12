import {css} from '@emotion/react';
import React from 'react';
import siren from '@/assets/icons/siren.webp';
import Btn from '../common/btn/Btn';

const containerStyle = css`
  width: 100%;
  height: 90px;
`;

const contentStyle = css`
  display: flex; /* 이미지와 텍스트를 가로로 배치 */
  align-items: center; /* 세로 중앙 정렬 */
  padding: 20px;

  img {
    width: 34px;
    margin-right: 20px; /* 이미지와 텍스트 사이 간격 */
  }
`;

const titleStyle = css`
  font-family: 'semibold';
  font-size: 18px;
`;

const textStyle = css`
  font-family: 'regular';
  font-size: 18px;
`;

const buttonContainerStyle = css`
  display: flex; /* 버튼들을 가로로 배치 */
  gap: 10px; /* 버튼 사이 간격 추가 */
  margin-top: 10px; /* 텍스트와 버튼 사이 간격 추가 */
`;

const timeStyle = css`
  font-family: 'regular';
  font-size: 12px;
  margin-bottom: 5px;
`;

const travelName: string = '아기돼지오형제';

const nickName: Nickname = '훈민';

export default function PublicRequest() {
  return (
    <div css={containerStyle}>
      <div css={contentStyle}>
        <img src={siren} alt="Notification Icon" />
        <div>
          <p css={timeStyle}>2024.09.03 13:10</p>
          <span css={titleStyle}>{travelName}</span>
          <span css={textStyle}>
            에서 <span css={titleStyle}>{nickName}</span>님의 몫이
            300,000원(20%) 밖에 남지 않았어요!
            <br />
            개인입금을 통해 통장에 돈을 채워주세요!
          </span>
          <div css={buttonContainerStyle}>
            <Btn buttonStyle={{style: 'red', size: 'tiny'}}>취소</Btn>
            <Btn buttonStyle={{style: 'blue', size: 'tiny'}}>수락</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
