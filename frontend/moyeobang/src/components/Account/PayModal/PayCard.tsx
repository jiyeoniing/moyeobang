import React from "react"
import backgroundImage from '@/assets/images/skyBackground.jpg'
import { css } from "@emotion/react"
import { colors } from "@/styles/colors"
import useTravelDetailStore from "@/store/useTravelDetailStore"
import { useSuspenseQuery } from "@tanstack/react-query";
import moyeobang from "@/services/moyeobang"
import useCurrentTravelStore from "@/store/useCurrentTravelStore"

const cardLayoutStyle = css`
    width: 330px;
    height: 200px;
    margin-top: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(${backgroundImage});
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background-size: cover;
    position: relative;
    border-radius: 10px;
`;

const overlayStyle = css`
    position: absolute;
    box-sizing: border-box;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    z-index: 1;   
    border-radius: 10px; 
`;

const titleStyle = css`
    font-family: 'bold';
    font-size: 24px;
    color: ${colors.fifth};
`;

const timeStyle = css`
    font-family: 'semibold';
    font-size: 15px;
    color: ${colors.gray};
`;

const locationLayoutStyle = css`
    display:flex;
    flex-direction:row;
    gap:5px;
`;

const locationStyle = css`
    font-family: 'semibold';
    font-size: 16px;
`;

const balanceStyle = css`
    font-family: 'semibold';
    font-size: 20px; 
    text-align: right;
`;

export default function PayCard() {

    
    const {travelName} = useCurrentTravelStore();
    const {startDate} = useCurrentTravelStore();
    const {endDate} = useCurrentTravelStore();
    const {travelPlaceList} = useCurrentTravelStore();
    const {accountId} = useCurrentTravelStore();
    
    // get 모임 통장 전체 잔액 
    const { data } = useSuspenseQuery({
        queryKey: ['accoutByGroup', accountId],
        queryFn: () => moyeobang.getAccountState(accountId),
    });

    const accountData = data.data.data;

    return (

        <div css={cardLayoutStyle}>
            <div css={overlayStyle}>
            <div css={titleStyle}>{travelName}</div>
            <div css={timeStyle}>{startDate}~{endDate}</div>
            <div css={locationLayoutStyle}>{travelPlaceList.map((place, index) => {

                if (index===travelPlaceList.length-1) {
                    return <div key={index} css={locationStyle}>{place}</div>
                } else {
                    return <div key={index} css={locationStyle}>{place},</div>
                }
            }
            )}</div>
            <div css={balanceStyle} >{accountData.currentBalance.toLocaleString()}원</div>
            </div>
        </div>
    )
}