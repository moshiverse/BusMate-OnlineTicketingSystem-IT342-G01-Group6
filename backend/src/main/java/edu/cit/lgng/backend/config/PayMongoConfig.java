package edu.cit.lgng.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class PayMongoConfig {

    @Value("${paymongo.secret-key}")
    private String secretKey;

    @Value("${paymongo.public-key}")
    private String publicKey;

    @Value("${paymongo.base-url:https://api.paymongo.com/v1}")
    private String baseUrl;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    public String getSecretKey() {
        return secretKey;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public String getEncodedSecretKey() {
        return java.util.Base64.getEncoder().encodeToString((secretKey + ":").getBytes());
    }
}