package com.ssafy.moyeobang.docs;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.preprocessResponse;
import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.ssafy.moyeobang.account.adapter.in.web.response.GetAccountMemberBalanceResponse;
import com.ssafy.moyeobang.account.application.domain.Money;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.restdocs.payload.JsonFieldType;

public class GetAccountMemberBalanceControllerDocsTest extends RestDocsSupport {

    @DisplayName("모임 통장 개인 별 잔액 조회 API")
    @Test
    void getAccountMemberBalance() throws Exception {
        GetAccountMemberBalanceResponse response = new GetAccountMemberBalanceResponse(
                1L,
                "김두열",
                "https://profile-image.url",
                Money.of(15000),
                Money.of(20000),
                Money.of(5000)
        );

        given(getAccountMemberBalanceQuery.getAccountMemberBalance(any(Long.class), any(Long.class)))
                .willReturn(response);

        mockMvc.perform(
                        get("/api/accounts/{accountId}/balance/member/{memberId}", 1L, 1L)
                )
                .andDo(print())
                .andExpect(status().isOk())
                .andDo(document("get-account-member-balance",
                                preprocessResponse(prettyPrint()),
                                responseFields(
                                        fieldWithPath("status").type(JsonFieldType.STRING)
                                                .description("API 성공 여부"),
                                        fieldWithPath("data").type(JsonFieldType.OBJECT)
                                                .description("응답"),
                                        fieldWithPath("data.simpleUserProfile").type(JsonFieldType.OBJECT)
                                                .description("멤버 프로필 정보"),
                                        fieldWithPath("data.simpleUserProfile.memberId").type(JsonFieldType.NUMBER)
                                                .description("멤버 id"),
                                        fieldWithPath("data.simpleUserProfile.memberName").type(JsonFieldType.STRING)
                                                .description("멤버 이름"),
                                        fieldWithPath("data.simpleUserProfile.profileImage").type(JsonFieldType.STRING)
                                                .description("멤버 프로필 이미지"),
                                        fieldWithPath("data.personalCurrentBalance").type(JsonFieldType.NUMBER)
                                                .description("현재 잔액"),
                                        fieldWithPath("data.personalTotalAmount").type(JsonFieldType.NUMBER)
                                                .description("총 입금 금액"),
                                        fieldWithPath("data.personalTotalSpent").type(JsonFieldType.NUMBER)
                                                .description("총 사용 금액"),
                                        fieldWithPath("data.personalUsagePercentage").type(JsonFieldType.NUMBER)
                                                .description("사용 비율"),
                                        fieldWithPath("data.needsAdditionalDeposit").type(JsonFieldType.BOOLEAN)
                                                .description("추가 입금이 필요한지 여부"),
                                        fieldWithPath("error").type(JsonFieldType.NULL)
                                                .description("에러")
                                )
                        )
                );
    }
}
