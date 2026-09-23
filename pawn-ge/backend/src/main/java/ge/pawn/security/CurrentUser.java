package ge.pawn.security;

import ge.pawn.auth.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/** Resolves the authenticated user server-side. Never trust client-supplied tenant ids. */
public final class CurrentUser {

    private CurrentUser() {}

    public static User require() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof User user)) {
            throw new org.springframework.security.access.AccessDeniedException("Not authenticated");
        }
        return user;
    }

    /** Tenant id resolved from the authenticated identity only. */
    public static Long requireLombardTenantId() {
        User user = require();
        if (user.getLombard() == null) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "No Lombard tenant associated with this account");
        }
        return user.getLombard().getId();
    }
}
