SELECT TOP 20 
qt.text AS 'SP Name', 
qs.total_worker_time AS 'TotalWorkerTime', 
qs.total_worker_time/qs.execution_count AS 'AvgWorkerTime',
qs.execution_count AS 'Execution Count', 
ISNULL(qs.execution_count/DATEDIFF(Second, qs.creation_time, GetDate()), 0) AS 'Calls/Second',
ISNULL(qs.total_elapsed_time/qs.execution_count, 0) AS 'AvgElapsedTime', 
qs.max_logical_reads, 
qs.max_logical_writes, 
DATEDIFF(Minute, qs.creation_time, GetDate()) AS 'Age in Cache'
FROM sys.dm_exec_query_stats AS qs CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) AS qt
--WHERE qt.dbid = db_id() -- Filter by current database
ORDER BY qs.total_worker_time DESC