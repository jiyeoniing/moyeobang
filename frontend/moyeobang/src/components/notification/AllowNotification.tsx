import React from 'react';
import {css} from '@emotion/react';
import Btn from '../common/btn/Btn';
import {colors} from '@/styles/colors';
import {requestPermissionAndSaveToken} from '@/services/notificationService';

const modalOverlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 어두운 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 101;
`;

const modalContainerStyle = css`
  width: 65%;
  padding: 30px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const questionStyle = css`
  font-family: 'semibold';
  font-size: 20px;
  color: ${colors.black};
  margin-bottom: 20px;
`;

const descriptionStyle = css`
  font-family: 'regular';
  font-size: 16px;
  color: ${colors.gray};
  margin-bottom: 20px;
  line-height: 1.5;
`;

const buttonContainerStyle = css`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

interface AllowNotificationProps {
  onClose: () => void;
}

export default function AllowNotification({onClose}: AllowNotificationProps) {
  // const handleAllowClick = () => {
  //   // 푸시 알림 권한 요청 및 FCM 토큰 저장
  //   requestPermissionAndSaveToken()
  //     .then(() => {
  //       console.log('푸시 알림 권한 허용 및 토큰 저장 성공');
  //       onClose(); // 모달 닫기
  //     })
  //     .catch((error: Error) => {
  //       console.error('푸시 알림 권한 요청 실패:', error);
  //       onClose(); // 실패해도 모달 닫기
  //     });
  // };
  return (
    <div css={modalOverlayStyle}>
      <div css={modalContainerStyle}>
        <h3 css={questionStyle}>
          &apos;모여방&apos;에서 푸시알림을 보내고자 합니다
        </h3>
        <p css={descriptionStyle}>
          경고, 사운드, 아이콘 배지가 알림에 포함될 수 있습니다. 설정에서 이를
          구성할 수 있습니다.
        </p>
        <div css={buttonContainerStyle}>
          <Btn buttonStyle={{style: 'red', size: 'middle'}} onClick={onClose}>
            허용 안함
          </Btn>
          <Btn
            buttonStyle={{style: 'blue', size: 'middle'}}
            // onClick={handleAllowClick}
            onClick={onClose}
          >
            승인
          </Btn>
        </div>
      </div>
    </div>
  );
}
