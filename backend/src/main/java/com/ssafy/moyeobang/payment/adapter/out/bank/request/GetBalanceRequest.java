package com.ssafy.moyeobang.payment.adapter.out.bank.request;


import com.ssafy.moyeobang.payment.adapter.out.bank.Headers;

public record GetBalanceRequest(Headers Header, String accountNo) {
}
