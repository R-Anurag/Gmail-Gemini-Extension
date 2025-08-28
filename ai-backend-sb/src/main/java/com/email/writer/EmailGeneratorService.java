package com.email.writer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class EmailGeneratorService {
    private final WebClient webClient;
    private final String apiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder,
                                 @Value("${gemini.api.url}") String baseUrl,
                                 @Value("${gemini.api.key}") String geminiApiKey) {
        this.webClient = webClientBuilder.baseUrl(baseUrl).build();
        this.apiKey = geminiApiKey;
    }

    public String generateEmailReply(EmailRequest emailRequest) {
        // Create Prompt
        String prompt = buildPrompt(emailRequest);

        // Prepare Raw JSON Body
        String requestBody = String.format("""
                {
                    "contents": [
                      {
                        "parts": [
                          {
                            "text": "%s"
                          }
                        ]
                      }
                    ]
                  }
                """, prompt);

        // Send Request
        String response = webClient.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/v1beta/models/gemini-2.0-flash:generateContent")
                        .build())
                .header("X-goog-api-key", apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // Extract Response
        return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            return root.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .get("text")
                    .asText();
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();

        // Strictly Anurag identity
        prompt.append("You are Anurag. Write this email reply entirely from Anurag's perspective. ")
                .append("The reply should be properly structured with line breaks: ")
                .append("include only the body paragraphs separated by blank lines, and end with a closing. ");

        String tone = emailRequest.getTone();
        if (tone != null && !tone.isEmpty()) {
            if (tone.equalsIgnoreCase("Formal") ||
                    tone.equalsIgnoreCase("Casual") ||
                    tone.equalsIgnoreCase("Friendly")) {
                prompt.append("Use a ").append(tone).append(" tone. ");
            } else {
                prompt.append("Write the reply as Anurag, but mimic the phrasing, humor, and communication style of ")
                        .append(tone)
                        .append(". ")
                        .append("Do NOT roleplay as this person or sign the email as them. ")
                        .append("Keep the identity strictly as Anurag. ");
            }
        }

        prompt.append("Do not include any signature or name at the end. ")
                .append("Here is the original email you are replying to:\n")
                .append(emailRequest.getEmailContent());

        return prompt.toString();
    }
}
