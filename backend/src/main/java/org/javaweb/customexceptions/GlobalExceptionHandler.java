package org.javaweb.customexceptions;

import org.javaweb.exceptions.InvalidTokenException;
import org.javaweb.exceptions.RefreshTokenExceptions;
import org.javaweb.exceptions.UserNotFoundException;
import org.javaweb.model.dto.ErrorDTO;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

import javax.servlet.http.HttpServletRequest;
import javax.xml.crypto.Data;
import java.util.Collections;
import java.util.Date;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.zip.DataFormatException;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex, HttpServletRequest request) {
            Map<String, String> errors = ex.getBindingResult()
                    .getFieldErrors()
                    .stream()
                    .collect(Collectors.toMap(
                            fieldError -> fieldError.getField(),
                            fieldError -> fieldError.getDefaultMessage(),
                            (msg1, msg2) -> msg1
                    ));
        ErrorDTO errorDetais = new ErrorDTO();
        errorDetais.getTimestamp();
        errorDetais.setStatus(HttpStatus.BAD_REQUEST.value());
        errorDetais.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());
        errorDetais.setMessage(ex.getFieldError().getDefaultMessage());
        errorDetais.setPath(request.getRequestURI());
        errorDetais.setDetails(errors);
        return new ResponseEntity<>(errorDetais, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({DataFormatException.class, BadCredentialsException.class})
    public ResponseEntity<ErrorDTO> handleDataFormatException(Exception  ex, HttpServletRequest request){
        ErrorDTO errorDetais = new ErrorDTO();
        errorDetais.getTimestamp();
        errorDetais.setStatus(HttpStatus.UNAUTHORIZED.value());
        errorDetais.setError(HttpStatus.UNAUTHORIZED.getReasonPhrase());
        errorDetais.setMessage(ex.getMessage());
        errorDetais.setPath(request.getRequestURI());
        return new ResponseEntity<>(errorDetais, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorDTO> handleDataIntegrityViolationException(DataIntegrityViolationException ex, HttpServletRequest request){
        ErrorDTO errorDetais = new ErrorDTO();
        errorDetais.getTimestamp();
        errorDetais.setStatus(HttpStatus.BAD_REQUEST.value());
        errorDetais.setError(HttpStatus.BAD_REQUEST.getReasonPhrase());
        errorDetais.setMessage(ex.getMessage());
        errorDetais.setPath(request.getRequestURI());
        return new ResponseEntity<>(errorDetais, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<?> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body("Dữ liệu JSON không hợp lệ. Vui lòng kiểm tra cú pháp.");
    }

    @ExceptionHandler(value = RefreshTokenExceptions.class)
    public ResponseEntity<ErrorDTO> handleRefreshTokenException(RefreshTokenExceptions ex, WebRequest request) {
        ErrorDTO errorDetails = new ErrorDTO();
        errorDetails.getTimestamp();
        errorDetails.setStatus(HttpStatus.FORBIDDEN.value());
        errorDetails.setError(HttpStatus.FORBIDDEN.getReasonPhrase());
        errorDetails.setMessage(ex.getMessage());
        return new ResponseEntity<>(errorDetails, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<?> handleInvalidToken(InvalidTokenException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("error", ex.getMessage()));
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleUserNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("error", ex.getMessage()));
    }
}

