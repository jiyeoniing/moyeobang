package com.ssafy.moyeobang.schedule.application.port.in;

import com.ssafy.moyeobang.schedule.application.domain.ScheduleImage;
import java.io.IOException;
import java.time.LocalDateTime;
import org.springframework.web.multipart.MultipartFile;

public record UpdateTravelScheduleCommand(
        long travelId, long scheduleId, String scheduleTitle, LocationInfoCommand scheduleLocation,
        LocalDateTime scheduleTime,
        String memo, ScheduleImage scheduleImage) {

    public UpdateTravelScheduleCommand(long travelId, long scheduleId, String scheduleTitle,
                                       LocationInfoCommand scheduleLocation,
                                       LocalDateTime scheduleTime, String memo, MultipartFile imageFile)
            throws IOException {
        this(travelId, scheduleId, scheduleTitle, scheduleLocation, scheduleTime, memo,
                imageFile != null ? new ScheduleImage(imageFile.getOriginalFilename(),
                        imageFile.getContentType(),
                        imageFile.getInputStream(),
                        imageFile.getSize())
                        : null);


    }
}
