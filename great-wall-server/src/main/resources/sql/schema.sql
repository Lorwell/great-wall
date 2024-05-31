CREATE TABLE IF NOT EXISTS monitor_metrics_record
(
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    ip            VARCHAR(50)  NOT NULL,
    host          VARCHAR(100) NOT NULL,
    method        VARCHAR(20)  NOT NULL,
    context_path  VARCHAR(100) NOT NULL,
    app_path      VARCHAR(255) NOT NULL,
    query_params  text         NOT NULL,
    cookies       text         NOT NULL,
    request_time  BIGINT       NOT NULL,
    response_time BIGINT       NOT NULL,
    status_code   INT          NOT NULL
);

CREATE TABLE IF NOT EXISTS app_route
(
    id               BIGINT PRIMARY KEY AUTO_INCREMENT,
    name             VARCHAR(50) NOT NULL,
    describe         VARCHAR(150),
    priority         INT         NOT NULL,
    urls             LONGTEXT    NOT NULL,
    app_order        INT         NOT NULL,
    predicates       LONGTEXT    NOT NULL,
    status           VARCHAR(20) NOT NULL,
    create_time      BIGINT      NOT NULL,
    last_update_time BIGINT      NOT NULL
);