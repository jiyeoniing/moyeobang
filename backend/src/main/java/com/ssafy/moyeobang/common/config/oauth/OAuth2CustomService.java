package com.ssafy.moyeobang.common.config.oauth;

import com.ssafy.moyeobang.common.config.oauth.dto.CustomOAuth2User;
import com.ssafy.moyeobang.common.config.oauth.dto.GoogleResponse;
import com.ssafy.moyeobang.common.config.oauth.dto.KakaoResponse;
import com.ssafy.moyeobang.common.config.oauth.dto.OAuth2Response;
import com.ssafy.moyeobang.common.config.oauth.dto.OAuth2UserDto;
import com.ssafy.moyeobang.common.persistenceentity.member.MemberJpaEntity;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OAuth2CustomService extends DefaultOAuth2UserService {

    private final MemberRepositoryInOAuth memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User user = super.loadUser(userRequest);
        log.info("find OAuth2User: {}", user);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        log.info("find registrationId: {}", registrationId);

        OAuth2Response response = null;

        if (registrationId.equals("kakao")) {
            response = new KakaoResponse(user.getAttributes());
        } else if (registrationId.equals("google")) {
            response = new GoogleResponse(user.getAttributes());
        } else {
            return null;
        }

        Optional<MemberJpaEntity> findMember = memberRepository.findByEmail(response.getEmail());

        if (findMember.isEmpty()) {

            MemberJpaEntity createMember = response.toEntity();

            memberRepository.save(createMember);

            OAuth2UserDto oAuth2User = toOAuth2UserDto(createMember);

            log.info("new oAuth2User: {}", oAuth2User);

            return new CustomOAuth2User(oAuth2User);
        } else {

            MemberJpaEntity member = findMember.get();

            log.info("exist oAuth2User: {}", member);

            OAuth2UserDto oAuth2User = toOAuth2UserDto(member);

            return new CustomOAuth2User(oAuth2User);
        }
    }

    private OAuth2UserDto toOAuth2UserDto(MemberJpaEntity member) {

        return new OAuth2UserDto(
                member.getEmail(),
                member.getUsername(),
                member.getRole()
        );
    }
}