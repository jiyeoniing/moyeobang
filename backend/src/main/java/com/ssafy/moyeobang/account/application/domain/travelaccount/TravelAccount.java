package com.ssafy.moyeobang.account.application.domain.travelaccount;

import static java.time.LocalDateTime.now;

import com.ssafy.moyeobang.account.application.domain.Member;
import com.ssafy.moyeobang.account.application.domain.Money;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class TravelAccount {

    private final String accountNumber;
    private final Members members;
    private final Transactions transactions;

    public void deposit(Member member, Money money) {
        Deposit deposit = Deposit.builder()
                .transactionAccountNumber(member.getAccountNumber())
                .timestamp(now())
                .money(money)
                .balanceSnapshot(Money.add(getBalance(), money))
                .depositMember(member)
                .build();

        transactions.add(deposit);
    }

    public Money getBalance() {
        return Money.subtract(
                transactions.getDepositBalance(),
                transactions.getWithdrawalBalance()
        );
    }

    public List<Transaction> getTransactionsRelatedTo(Set<Long> memberIds) {
        return transactions.getTransactionsRelatedTo(
                members.getMembers(memberIds)
        );
    }

    public Optional<Withdrawal> findTransactionBy(Long transactionId) {
        return transactions.getTransactions().stream()
                .filter(transaction -> transaction.getType().equals(TransactionType.WITHDRAWAL))
                .filter(transaction -> transaction.getTransactionId().equals(transactionId))
                .findFirst()
                .map(Withdrawal.class::cast);
    }
}
