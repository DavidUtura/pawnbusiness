package ge.pawn.auth;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserRole {
    CUSTOMER("CUSTOMER"),
    LOMBARD_EMPLOYEE("LOMBARD_EMPLOYEE"),
    LOMBARD_ADMIN("LOMBARD_ADMIN"),
    SUPER_ADMIN("SUPER_ADMIN");

    private final String value;

    public static UserRole fromValue(String value) {
        for (UserRole role : UserRole.values()) {
            if (role.value.equalsIgnoreCase(value)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Invalid role: " + value);
    }
}
