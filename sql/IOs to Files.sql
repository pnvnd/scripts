--Grab a Baseline....
SELECT DB_NAME(mf.database_id) AS databasename,
mf.physical_name,
divfs.num_of_reads,
divfs.num_of_bytes_read,
divfs.io_stall_read_ms,
divfs.num_of_writes,
divfs.num_of_bytes_written,
divfs.io_stall_write_ms,
divfs.io_stall,
size_on_disk_bytes,
GETDATE() AS baselinedate
INTO #baseline
FROM sys.dm_io_virtual_file_stats(NULL, NULL) AS divfs
INNER JOIN sys.master_files AS mf ON mf.database_id = divfs.database_id
AND mf.file_id = divfs.file_id

select * from #baseline

---WAIT FOR A WHILE, then take a 2nd reading:

WITH currentline
	AS (SELECT DB_NAME(mf.database_id) AS databasename,
			mf.physical_name,
			divfs.num_of_reads,
			divfs.num_of_bytes_read,
			divfs.io_stall_read_ms,
			divfs.num_of_writes,
			divfs.num_of_bytes_written,
			divfs.io_stall_write_ms,
			divfs.io_stall,
			size_on_disk_bytes,
			GETDATE() AS currentlinedate
		FROM sys.dm_io_virtual_file_stats(NULL, NULL) AS divfs
		INNER JOIN sys.master_files AS mf ON mf.database_id = divfs.database_id
		AND mf.file_id = divfs.file_id 
		)
SELECT 
currentline.databasename,
LEFT(currentline.physical_name,1) AS drive,
currentline.physical_name,
DATEDIFF(millisecond,baselinedate, currentlinedate) as elapsed_ms,
currentline.io_stall - #baseline.io_stall AS io_stall_ms,
currentline.io_stall_read_ms - #baseline.io_stall_read_ms AS io_stall_read_ms,
currentline.io_stall_write_ms - #baseline.io_stall_write_ms AS io_stall_write_ms,
currentline.num_of_reads - #baseline.num_of_reads AS num_of_reads,
currentline.num_of_writes - #baseline.num_of_writes AS num_of_writes,
currentline.num_of_bytes_written - #baseline.num_of_bytes_written AS num_of_bytes_written
FROM currentline INNER JOIN #baseline ON #baseline.databasename = currentline.databasename
AND #baseline.physical_name = currentline.physical_name
--WHERE #baseline.databasename = 'DatabaseName'

