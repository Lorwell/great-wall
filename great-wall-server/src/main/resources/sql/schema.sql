CREATE TABLE IF NOT EXISTS cache
(
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(50)  NOT NULL,
    cache_key       VARCHAR(128) NOT NULL,
    cache_value     LONGTEXT     NULL,
    expiration_time BIGINT       NOT NULL,
    constraint uk_cache unique (name, cache_key)
);

CREATE TABLE IF NOT EXISTS app_route
(
    id               BIGINT PRIMARY KEY AUTO_INCREMENT,
    name             VARCHAR(50) NOT NULL,
    describe         VARCHAR(150),
    priority         INT         NOT NULL,
    urls             LONGTEXT    NOT NULL,
    predicates       LONGTEXT    NOT NULL,
    status           VARCHAR(20) NOT NULL,
    create_time      BIGINT      NOT NULL,
    last_update_time BIGINT      NOT NULL
);