package com.ssafy.moyeobang.payment.adapter.out;

import com.ssafy.moyeobang.common.annotation.PersistenceAdapter;
import com.ssafy.moyeobang.common.persistenceentity.travel.TravelAccountJpaEntity;
import com.ssafy.moyeobang.common.persistenceentity.withdraw.SettleType;
import com.ssafy.moyeobang.common.persistenceentity.withdraw.WithdrawJpaEntity;
import com.ssafy.moyeobang.payment.adapter.out.bank.BankApiClientInPayment;
import com.ssafy.moyeobang.payment.adapter.out.persistence.travelaccount.TravelAccountRepositoryInPayment;
import com.ssafy.moyeobang.payment.adapter.out.persistence.withdraw.WithdrawRepositoryInPayment;
import com.ssafy.moyeobang.payment.application.domain.Money;
import com.ssafy.moyeobang.payment.application.domain.Store;
import com.ssafy.moyeobang.payment.application.domain.TravelAccount;
import com.ssafy.moyeobang.payment.application.port.out.CreateAccountPort;
import com.ssafy.moyeobang.payment.application.port.out.LoadTravelAccountPort;
import com.ssafy.moyeobang.payment.application.port.out.PaymentResult;
import com.ssafy.moyeobang.payment.application.port.out.ProcessPaymentPort;
import com.ssafy.moyeobang.payment.error.ErrorCode;
import com.ssafy.moyeobang.payment.error.PaymentException;
import lombok.RequiredArgsConstructor;

@PersistenceAdapter
@RequiredArgsConstructor
public class BankPaymentAdapter implements LoadTravelAccountPort, ProcessPaymentPort, CreateAccountPort {

    private final BankApiClientInPayment bankApiClientInPayment;

    private final TravelAccountRepositoryInPayment travelAccountRepository;
    private final WithdrawRepositoryInPayment withdrawRepository;

    @Override
    public String createAccount(String memberKey) {
        String accountNumber = bankApiClientInPayment.createAccount(memberKey);

        TravelAccountJpaEntity account = TravelAccountJpaEntity.builder()
                .accountNumber(accountNumber)
                .build();

        travelAccountRepository.save(account);

        return accountNumber;
    }

    @Override
    public TravelAccount loadTravelAccount(String accountNumber) {
        Long balance = bankApiClientInPayment.getBalance(accountNumber);

        return TravelAccount.of(
                accountNumber,
                Money.of(balance)
        );
    }

    @Override
    public PaymentResult processPayment(TravelAccount travelAccount, Store store, Money paymentRequestMoney,
                                        String paymentRequestId) {
        TravelAccountJpaEntity travelAccountEntity = getTravelAccount(travelAccount.getAccountNumber());

        WithdrawJpaEntity withdraw = createPaymentWithdraw(travelAccountEntity, store,
                Money.subtract(travelAccount.getBalance(), paymentRequestMoney).getAmount(), paymentRequestMoney,
                paymentRequestId, store.getStoreAccountNumber());

        WithdrawJpaEntity savedWithdraw = withdrawRepository.save(withdraw);

        bankApiClientInPayment.payment(
                store.getStoreAccountNumber(),
                travelAccount.getAccountNumber(),
                paymentRequestMoney.getAmount()
        );

        return new PaymentResult(savedWithdraw.getId());
    }

    private TravelAccountJpaEntity getTravelAccount(String accountNumber) {
        return travelAccountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new PaymentException(ErrorCode.TRAVEL_ACCOUNT_NOT_FOUND));
    }

    private WithdrawJpaEntity createPaymentWithdraw(TravelAccountJpaEntity travelAccount, Store store,
                                                    long balanceSnapshot,
                                                    Money paymentRequestMoney, String paymentRequestId,
                                                    String targetAccountNumber) {
        return WithdrawJpaEntity.builder()
                .title(store.getStoreName())
                .latitude(store.getLatitude())
                .longitude(store.getLongitude())
                .amount(paymentRequestMoney.getAmount())
                .balanceSnapshot(balanceSnapshot)
                .targetAccountNumber(targetAccountNumber)
                .travelAccount(travelAccount)
                .placeId(store.getStoreId())
                .placeName(store.getStoreName())
                .placeAddress(store.getStoreAddress())
                .settleType(SettleType.CUSTOM)
                .paymentRequestId(paymentRequestId)
                .build();
    }

}
