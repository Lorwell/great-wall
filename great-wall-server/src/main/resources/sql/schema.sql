CREATE TABLE IF NOT EXISTS cache
(
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(50)  NOT NULL,
    cache_key       VARCHAR(128) NOT NULL,
    cache_value     LONGTEXT     NOT NULL,
    expiration_time BIGINT       NOT NULL,
    constraint uk_cache unique (name, cache_key)
);

CREATE TABLE IF NOT EXISTS app_route
(
    id               BIGINT PRIMARY KEY AUTO_INCREMENT,
    name             VARCHAR(50) NOT NULL,
    describe         VARCHAR(150),
    priority         INT         NOT NULL,
    target_config    LONGTEXT    NOT NULL,
    predicates       LONGTEXT    NOT NULL,
    status           VARCHAR(20) NOT NULL,
    create_time      BIGINT      NOT NULL,
    last_update_time BIGINT      NOT NULL
);

CREATE TABLE IF NOT EXISTS app_tls
(
    id               BIGINT PRIMARY KEY AUTO_INCREMENT,
    uk_key           VARCHAR(50) NOT NULL unique,
    type             VARCHAR(50) NOT NULL,
    config           LONGTEXT    NOT NULL,
    expired_time     BIGINT      NULL,
    create_time      BIGINT      NOT NULL,
    last_update_time BIGINT      NOT NULL
);