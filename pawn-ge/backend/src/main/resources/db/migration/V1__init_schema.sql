-- ============================================================
-- Pawn.ge — V1 initial schema (PostgreSQL)
-- Matches JPA entities in ge.pawn.* exactly.
-- ============================================================

CREATE TABLE lombards (
    id              BIGSERIAL PRIMARY KEY,
    created_at      TIMESTAMP       NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP,
    name            VARCHAR(255)    NOT NULL UNIQUE,
    slug            VARCHAR(255)    NOT NULL UNIQUE,
    description     VARCHAR(255),
    logo_url        VARCHAR(255),
    cover_image_url VARCHAR(255),
    phone_number    VARCHAR(255)    NOT NULL,
    email           VARCHAR(255)    NOT NULL,
    website         VARCHAR(255),
    address         VARCHAR(255),
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,
    active          BOOLEAN         NOT NULL DEFAULT TRUE
);

CREATE TABLE users (
    id             BIGSERIAL PRIMARY KEY,
    created_at     TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP,
    email          VARCHAR(255) NOT NULL UNIQUE,
    password       VARCHAR(255) NOT NULL,
    first_name     VARCHAR(255) NOT NULL,
    last_name      VARCHAR(255),
    phone_number   VARCHAR(255) NOT NULL,
    role           VARCHAR(50)  NOT NULL,
    enabled        BOOLEAN      NOT NULL DEFAULT TRUE,
    refresh_token  VARCHAR(255),
    lombard_id     BIGINT REFERENCES lombards (id)
);

CREATE TABLE branches (
    id           BIGSERIAL PRIMARY KEY,
    created_at   TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at   TIMESTAMP,
    lombard_id   BIGINT       NOT NULL REFERENCES lombards (id),
    name         VARCHAR(255) NOT NULL,
    address      VARCHAR(255),
    latitude     DOUBLE PRECISION,
    longitude    DOUBLE PRECISION,
    phone_number VARCHAR(255) NOT NULL,
    email        VARCHAR(255),
    active       BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE products (
    id             BIGSERIAL PRIMARY KEY,
    created_at     TIMESTAMP      NOT NULL DEFAULT now(),
    updated_at     TIMESTAMP,
    lombard_id     BIGINT         NOT NULL REFERENCES lombards (id),
    branch_id      BIGINT         REFERENCES branches (id),
    category       VARCHAR(255)   NOT NULL,
    brand          VARCHAR(255)   NOT NULL,
    model          VARCHAR(255)   NOT NULL,
    title          VARCHAR(255)   NOT NULL,
    description    TEXT,
    price          NUMERIC(10, 2) NOT NULL,
    condition      VARCHAR(50)    NOT NULL,
    storage        VARCHAR(100),
    color          VARCHAR(100),
    serial_number  VARCHAR(255),
    imei           VARCHAR(64),
    imei2          VARCHAR(64),
    battery_health VARCHAR(100),
    status         VARCHAR(50)    NOT NULL,
    quantity       INTEGER        NOT NULL DEFAULT 1
);

CREATE TABLE product_images (
    id            BIGSERIAL PRIMARY KEY,
    created_at    TIMESTAMP  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP,
    product_id    BIGINT     NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    image_url     VARCHAR(255)  NOT NULL,
    s3_key        VARCHAR(255)  NOT NULL,
    alt_text      VARCHAR(255),
    display_order INTEGER    NOT NULL DEFAULT 0,
    is_primary    BOOLEAN    NOT NULL DEFAULT FALSE
);

CREATE TABLE lombard_applications (
    id                 BIGSERIAL PRIMARY KEY,
    created_at         TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at         TIMESTAMP,
    applicant_user_id  BIGINT       NOT NULL,
    lombard_id         BIGINT,
    status             VARCHAR(50)  NOT NULL DEFAULT 'PENDING',
    display_name       VARCHAR(255),
    legal_name         VARCHAR(255),
    tax_id             VARCHAR(255),
    contact_name       VARCHAR(255),
    phone              VARCHAR(255),
    email              VARCHAR(255),
    website            VARCHAR(255),
    branch_count       INTEGER,
    categories         VARCHAR(255),
    address            VARCHAR(255),
    working_hours      VARCHAR(255),
    delivery_available BOOLEAN,
    pickup_available   BOOLEAN,
    submitted_at       TIMESTAMP,
    reviewed_at        TIMESTAMP,
    reviewer_id        BIGINT,
    review_notes       VARCHAR(2000)
);

CREATE INDEX idx_users_email          ON users (email);
CREATE INDEX idx_users_lombard_id     ON users (lombard_id);
CREATE INDEX idx_branches_lombard_id  ON branches (lombard_id);
CREATE INDEX idx_products_lombard_id  ON products (lombard_id);
CREATE INDEX idx_products_status      ON products (status);
CREATE INDEX idx_products_category    ON products (category);
CREATE INDEX idx_product_images_pid   ON product_images (product_id);
CREATE INDEX idx_applications_status  ON lombard_applications (status);
CREATE INDEX idx_applications_user    ON lombard_applications (applicant_user_id);
