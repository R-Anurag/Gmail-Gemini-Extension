package com.email.writer;

import lombok.Data;

@Data
public class EmailRequest {
    public String emailContent;
    public String tone;
}
