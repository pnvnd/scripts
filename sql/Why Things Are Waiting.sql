SELECT top 3
	wait_type,
	waiting_tasks_count,
	wait_time_ms / 1000.0 AS wait_time_sec,
	CASE WHEN waiting_tasks_count = 0 THEN NULL
		ELSE wait_time_ms / 1000.0 / waiting_tasks_count
	END AS avg_wait_time_sec,
	max_wait_time_ms / 1000.0 AS max_wait_time_sec,
	(wait_time_ms - signal_wait_time_ms) / 1000.0 AS resource_wait_time_sec
FROM sys.dm_os_wait_stats
WHERE wait_type NOT IN --tasks that are actually good or expected
('CLR_SEMAPHONE','LAZYWRITER_SLEEP','RESOURCE_QUEUE','SLEEP_TASK','SLEEP_SYSTEMTASK','WAITFOR')
ORDER BY waiting_tasks_count DESC