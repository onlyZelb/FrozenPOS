package com.finalproject.frozenpos.Controller.api;

import com.finalproject.frozenpos.DTO.Auth.AuthRequest;
import com.finalproject.frozenpos.DTO.Auth.AuthResponse;
import com.finalproject.frozenpos.DTO.Auth.RegisterRequest;
import com.finalproject.frozenpos.Services.AuthService.JwtService;
import com.finalproject.frozenpos.Services.UserService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class ApiAuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    public ApiAuthController(AuthenticationManager authenticationManager,
                             JwtService jwtService,
                             UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );

        String token = jwtService.generateToken(authentication);
        Long expiresAt = jwtService.extractExpirationTime(token);

        return new AuthResponse(token, authentication.getName(), expiresAt);
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        // Register user and encode password
        userService.registerUser(request.getUsername(), request.getPassword());

        // Automatically authenticate after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        String token = jwtService.generateToken(authentication);
        Long expiresAt = jwtService.extractExpirationTime(token);

        return new AuthResponse(token, request.getUsername(), expiresAt);
    }

    @GetMapping("/validate")
    public String validateToken() {
        return "Token is valid";
    }
}
