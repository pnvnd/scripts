SELECT '[' + DB_NAME() + '].[' + su.[name] + '].[' + o.[name] + ']'
AS [statement],
i.[name] as [index_name],
ddius.[user_seeks] + ddius.[user_scans] + ddius.[user_lookups] as [reads],
ddius.[user_updates] as [updates],
SUM(SP.rows) as [total_rows]
FROM sys.dm_db_index_usage_stats ddius
INNER JOIN sys.indexes i ON ddius.[object_id] = i.[object_id]
AND i.[index_id] = ddius.[index_id]
INNER JOIN sys.partitions SP ON ddius.[object_id] = SP.[object_id]
AND SP.[index_id] = ddius.[index_id]
INNER JOIN sys.objects o ON ddius.[object_id] = o.[object_id]
INNER JOIN sys.sysusers su ON o.[schema_id] = su.[UID]
WHERE 
ddius.[database_id] = DB_ID() AND --current database only
ddius.[index_id] > 0
GROUP BY su.[name],
o.[name],
i.[name],
ddius.[user_seeks] + ddius.[user_scans] + ddius.[user_lookups],
ddius.[user_updates]
HAVING ddius.[user_seeks] + ddius.[user_scans] + ddius.[user_lookups] = 0
ORDER BY ddius.[user_updates] desc,
su.[name], o.[name], i.[name]