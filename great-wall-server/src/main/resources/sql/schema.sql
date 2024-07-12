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

CREATE TABLE IF NOT EXISTS settings
(
    id               BIGINT PRIMARY KEY AUTO_INCREMENT,
    settings_name    VARCHAR(50) NOT NULL unique,
    settings_value   TEXT        NULL,
    create_time      BIGINT      NOT NULL,
    last_update_time BIGINT      NOT NULL
);

-- 插入系统配置默认值
MERGE INTO settings t
    USING (SELECT 'redirectHttps'                                AS settings_name,
                  'true'                                         AS settings_value,
                  (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000) as current_timestamp_millis) s
ON (t.settings_name = s.settings_name)
WHEN MATCHED THEN
    UPDATE
    SET t.settings_value = t.settings_value
WHEN NOT MATCHED THEN
    INSERT (settings_name, settings_value, create_time, last_update_time)
    VALUES (s.settings_name, s.settings_value, s.current_timestamp_millis,
            s.current_timestamp_millis);

CREATE TABLE IF NOT EXISTS aaa
(
    id                   BIGINT PRIMARY KEY AUTO_INCREMENT,
    second_unit          BIGINT        NOT NULL,
    used_heap_memory     BIGINT        NOT NULL,
    max_heap_memory      BIGINT        NOT NULL,
    used_non_heap_memory BIGINT        NOT NULL,
    max_non_heap_memory  BIGINT        NOT NULL,
    process_cpu_load     decimal(1, 2) NOT NULL,
)