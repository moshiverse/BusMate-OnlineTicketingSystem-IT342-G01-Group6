package edu.cit.lgng.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

public class PayMongoDto {

    // ==================== REQUEST DTOs ====================

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreatePaymentIntentRequest {
        private Long bookingId;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttachPaymentMethodRequest {
        private String paymentIntentId;
        private String paymentMethodId;
        private String clientKey;
        private String returnUrl;
    }

    // ==================== RESPONSE DTOs ====================

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentIntentResponse {
        private String id;
        private String clientKey;
        private String status;
        private Integer amount;
        private String currency;
        private String description;
        private List<String> paymentMethodAllowed;
        private NextAction nextAction;
        private String publicKey; // For frontend use
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NextAction {
        private String type;
        private Redirect redirect;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Redirect {
        private String url;
        private String returnUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AttachPaymentResponse {
        private String id;
        private String status;
        private NextAction nextAction;
        private String paymentId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentStatusResponse {
        private String paymentIntentId;
        private String status;
        private Integer amount;
        private String paymentId;
        private Long bookingId;
    }

    // ==================== PayMongo API Response Structures ====================

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PayMongoResponse {
        private PayMongoData data;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PayMongoData {
        private String id;
        private String type;
        private PayMongoAttributes attributes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PayMongoAttributes {
        private Integer amount;
        private String currency;
        private String description;
        private String status;
        private String clientKey;
        private Boolean livemode;
        private List<String> paymentMethodAllowed;
        private List<Map<String, Object>> payments;
        private Map<String, Object> nextAction;
        private Map<String, String> metadata;
        private Long createdAt;
        private Long updatedAt;
    }
}