package ge.pawn.lombard.model;

import ge.pawn.common.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "lombards")
@Getter
@Setter
public class Lombard extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    private String description;

    private String logoUrl;

    private String coverImageUrl;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String email;

    private String website;

    private String address;

    private Double latitude;

    private Double longitude;

    @Column(nullable = false)
    private Boolean active = true;
}
