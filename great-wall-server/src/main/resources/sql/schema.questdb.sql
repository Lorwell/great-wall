CREATE TABLE IF NOT EXISTS monitor_metrics_record
(
    ip            symbol,
    host          symbol,
    method        symbol,
    context_path  varchar,
    app_path      varchar,
    query_params  varchar,
    cookies       varchar,
    request_time  timestamp,
    response_time timestamp,
    status_code   int
) TIMESTAMP(request_time) PARTITION BY DAY WAL;
