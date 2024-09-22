import {css} from '@emotion/react';

export const ScheduleMapSearchLayout = css`
  z-index: 30;
  position: fixed;
  top: 50px;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

export const LocationInputLayout = css`
  z-index: 40;
  width: 330px;
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 20px;
  font-family: 'regular';
`;

export const LocationInputStyle = css`
  width: 330px;
  height: 50px;
  border: 1px solid #1ec0ff;
  border-radius: 50px;
  padding: 12px 16px;
  box-sizing: border-box;
  margin-top: 10px;
  padding-right: 10px;
  font-size: 18px;

  &::placeholder {
    color: #b9b9b9;
    font-family: 'regular';
    font-size: 18px;
  }
`;

export const searchImgStyle = css`
  position: absolute;
  right: 16px;
  top: 60%;
  width: 25px;
  height: 25px;
  transform: translateY(-50%);
  cursor: pointer;
`;

export const MapLayout = css`
  width: 390px;
  height: 100vh;
  background-color: aquamarine;
  position: fixed;
  top: 0;
  left: 0;
`;
