SELECT s.session_id,
s.status,
s.login_name,
s.host_name,
r.blocking_session_id,
db_name(r.database_id),
r.command,
s.cpu_time,
s.reads,
s.writes,
c.last_write,
s.program_name,
r.wait_type,
r.wait_time,
r.last_wait_type,
r.wait_resource,
CASE s.transaction_isolation_level
	WHEN 0 THEN 'Unspecified'
	WHEN 1 THEN 'ReadUncommitted'
	WHEN 2 THEN 'ReadCommitted'
	WHEN 3 THEN 'Repeatable'
	WHEN 4 THEN 'Serializable'
	WHEN 5 THEN 'Snapshot'
END as transaction_isolation_level,
OBJECT_NAME(t.objectid, r.database_id) as OBJECT_NAME,
SUBSTRING(t.text, r.statement_start_offset / 2,
(CASE WHEN r.statement_end_offset = -1
THEN DATALENGTH(t.text)
ELSE r.statement_end_offset END - r.statement_start_offset) / 2) AS executing_statement,
p.query_plan
FROM sys.dm_exec_sessions s 
LEFT JOIN sys.dm_exec_requests r ON s.session_id = r.session_id
LEFT JOIN sys.dm_exec_connections c on s.session_id = c.session_id
CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t
CROSS APPLY sys.dm_exec_query_plan(r.Plan_handle) p
WHERE s.session_id <> @@SPID
ORDER BY s.session_id