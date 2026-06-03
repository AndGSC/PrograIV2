package una.jwtdemo01.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private final String SECRET = "iiQNXP?eCiT#zY45RbKHhJ6Ny9ag!NSQLy?rznCK";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generarToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 8 * 3600000))
                .signWith(key)
                .compact();
    }


    public String extraerUsername(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }
}