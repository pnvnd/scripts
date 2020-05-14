/* Set SQL Server memory */
DECLARE @MAXRAM INT = (SELECT CASE
		when physical_memory_kb/1024 between 6144 and 16384 then (physical_memory_kb/1024) - 4096
		when physical_memory_kb/1024 > 16384 then (physical_memory_kb/1024) - 8192
		else physical_memory_kb/1024/2 END
FROM sys.dm_os_sys_info)

EXEC sp_configure 'max server memory', @MAXRAM;
GO
RECONFIGURE;
GO

/* Generic Threshold, change up or down as needed */
EXEC sp_configure 'cost threshold for parallelism', 50;
GO
RECONFIGURE;  
GO

/* Number of logical cores divided by 2 */
DECLARE @MAXDOP INT = (SELECT CASE 
		when cpu_count < 18 then cpu_count/2 
		else '8' end 
FROM sys.dm_os_sys_info)

EXEC sp_configure 'max degree of parallelism', @MAXDOP;  
GO
RECONFIGURE;  
GO