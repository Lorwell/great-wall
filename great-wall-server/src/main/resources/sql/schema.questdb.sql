CREATE TABLE IF NOT EXISTS route_metrics_record
(
    ip                 symbol,
    host               varchar,
    method             symbol,
    app_path           varchar,
    query_params       varchar,
    request_time       timestamp,
    response_time      timestamp,
    status_code        int,
    app_route_id       long,
    target_url         varchar,
    request_body_size  long,
    response_body_size long
) TIMESTAMP(request_time) PARTITION BY DAY WAL;
