package com.ssafy.moyeobang.schedule.application.domain;

import com.ssafy.moyeobang.common.persistenceentity.withdraw.SettleType;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class Transaction {
    private long transactionId;
    private String paymentName;
    private LocalDateTime paymentTime;
    private long totalPrice;
    private String paymentRequestId;
    private SettleType splitMethod;
    private List<Participant> participantsInfo;
    private boolean isMatched;

    public static Transaction create(long transactionId, String paymentName, LocalDateTime paymentTime,
                                     long totalPrice,
                                     String paymentRequestId, SettleType splitMethod,
                                     List<Participant> participantsInfo, boolean isMatched) {
        return new Transaction(transactionId, paymentName, paymentTime, totalPrice, paymentRequestId,
                splitMethod, participantsInfo, isMatched);
    }
}