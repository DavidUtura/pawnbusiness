package ge.pawn.common;

import java.lang.annotation.*;

/**
 * Annotation to mark methods that should be audited.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Auditable {
    String action() default "";
    String entityType() default "";
}
