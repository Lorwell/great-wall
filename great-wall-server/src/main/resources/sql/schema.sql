CREATE TABLE IF NOT EXISTS monitor_metrics_record
(
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    ip            VARCHAR(50),
    host          VARCHAR(100),
    method        VARCHAR(20),
    context_path  VARCHAR(100),
    app_path      VARCHAR(255),
    query_params  text,
    cookies       text,
    request_time  BIGINT,
    response_time BIGINT,
    status_code   INT
);

CREATE TABLE IF NOT EXISTS app_route
(
    id               BIGINT PRIMARY KEY AUTO_INCREMENT,
    app_id           VARCHAR(50),
    uri              VARCHAR(255),
    app_order        INT,
    predicates       LONGTEXT,
    status           VARCHAR(20),
    create_time      BIGINT,
    last_update_time BIGINT,

    UNIQUE (app_id)
);