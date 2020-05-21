declare @FileName varchar(1024)
select @FileName = (select 'C:\Temp\DB_' + replace(replace(convert(nvarchar(20),GetDate(),120),':','-'),' ','_') + '.bak')
backup database [DB] to disk = @FileName with copy_only
GO
Use [DB]
GO
EXEC sp_MSforeachtable @command1="SET QUOTED_IDENTIFIER ON; ALTER INDEX ALL ON ? REBUILD WITH (FILLFACTOR = 80, SORT_IN_TEMPDB = ON, STATISTICS_NORECOMPUTE = ON)";
GO
EXEC sp_updatestats;
GO