package org.javaweb.model.dto;

import java.time.LocalDateTime;
import java.util.Map;

public class ErrorDTO {
    private LocalDateTime timestamp;
    private int status;
    private String message;
    private String error;
    private String path;
    private Map<String, String> details;

    public ErrorDTO() {
        this.timestamp = LocalDateTime.now();
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getPath() {
        return path;
    }

    public Map<String, String> getDetails() {
        return details;
    }
    public Map<String, String> getDetails(UserDTO userDTO) {
        return details;
    }

    public void setDetails(Map<String, String> details) {
        this.details = details;
    }

    public void setPath(String path) {
        this.path = path;
    }

}

