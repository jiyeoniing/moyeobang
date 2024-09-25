import React, { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { css } from '@emotion/react'
import { useState } from "react";
import Navbar from "@/components/common/navBar/Navbar";
import ProfileImage from "@/components/Account/ProfileImage/ProfileImage";
import AllImage from "@/components/Account/ProfileImage/AllImage";
import AccountCard from '@/components/Account/AccountCard/AccountCard';
import TransactionCard from '@/components/Account/TranSaction/TransactionCard';
import { profileData} from "@/data/data";
import moyeobang from '@/services/moyeobang';
import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
import Spinner from '@/components/Sipnner/Spinner';

export const Route = createFileRoute('/_layout/_protected/_layout/account/')({
  component: groupAccount
})

const layoutStyle = css`
    max-width: 100%;
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    align-items:center;
    height:100%;
    gap:10px;
`;

const profileListStyle = css`
    display: flex;
    flex-direction: row;
    justify-content:flex-start;
    align-items:center;
    padding: 10px 0;
    padding-left:10px;
    box-sizing:border-box;
    gap: 15px;
    width: 370px;

    overflow-x: auto;

    &::-webkit-scrollbar {
    display: none;
    }
`;

const accountCardStyle = css`
    max-width: 100%;
    display:flex;
    justify-content: center;
    /* padding: 20px; */
`;

const transactionListStyle = css`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;

  max-height: 390px; 
  overflow-y: auto; 
  width: 100%;

  &::-webkit-scrollbar {
    display: none; 
  }
`
const accountId = 1;
export default function groupAccount() {

  const allList = profileData.map((member) => member.memberId)
  type SelectedMember = MemberId[]; 
  const [ selectedMember , setSelectedMember ] = useState<SelectedMember>(allList) // default 전체임
  const [member, setMember] = useState<MemberId | null>(null);

  const {data : transactionData} = useSuspenseQuery({
    queryKey: ['transactionList', accountId, selectedMember ],
    queryFn: () => moyeobang.getTransactionList(Number(accountId), selectedMember),
  });

  // get 모임 통장 전체 잔액 
  const { data :accountDataByGroup } = useQuery({
    queryKey: ['accoutByGroup', accountId],
    queryFn: () => moyeobang.getAccountState(accountId),
    enabled: selectedMember.length>1 // 전체
  });

  //get 모임 통장 개인별 잔액
  const { data : accountDataByMember } = useQuery({
    queryKey: ['accountByMemberId', accountId, member],
    queryFn: () => {
      if ( selectedMember.length==1 && member) {
        return moyeobang.getAccountStateBymemberId(accountId, member)
      }
    },
    enabled: selectedMember.length==1 && selectedMember !== undefined && accountId !== undefined,// 개인별
  });

  const transactionListData = transactionData.data.data;

  // 타입 가드 함수
  function isAccountBalanceByGroup(
    accountData: AccountBalanceByGroup | AccountBalanceBymemberId
  ): accountData is AccountBalanceByGroup {
    return (accountData as AccountBalanceByGroup).totalAmount !== undefined;
  }

  const accountData = selectedMember.length > 1 
    ? accountDataByGroup?.data.data 
    : accountDataByMember?.data.data;

  if (!accountData) {
    return <Spinner/>;
  }

  function onMemberClick(memberId : MemberId | null) {
    if (memberId) {
        // 해당 memberId get요청
        setSelectedMember([memberId])
        setMember(memberId)
    } else {
        // 전체 조회
        const allList = profileData.map((member) => member.memberId)
        setSelectedMember(allList)
    }
  }  

  return (
    <>
    <div css={layoutStyle}>
        <div css={profileListStyle} >
        <AllImage
        isSelected={selectedMember.length>1}
        onClick={() => onMemberClick(null)}
        />
        { profileData.map((profile, index) => (
            <ProfileImage 
            key={index} 
            {...profile} 
            isSelected={selectedMember.length!==1 ? false : selectedMember.includes(profile.memberId) } 
            onClick={() => onMemberClick(profile.memberId)} />
        ))}
        </div>
        <div css={accountCardStyle} >
          {isAccountBalanceByGroup(accountData)  ? 
            <AccountCard 
            currentBalance={accountData.currentBalance}
            travelAccountNumber={'333333-12-8912312'}
            travelName={'아기돼지 오형제'}
            /> 
            :
            <AccountCard 
            currentBalance={accountData.personalCurrentBalance}
            travelAccountNumber={'333333-12-8912312'}
            travelName={'아기돼지 오형제'}
            memberName={'가현'}
            />
          }
        </div>
        <div css={transactionListStyle}>
            {transactionListData.reverse().map((tran, index) => 
                <TransactionCard key={index} {...tran} />
            )}
        </div>
    </div>
    <Navbar/>
    </>
  )
}