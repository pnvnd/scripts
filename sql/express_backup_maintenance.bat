"C:\Program Files\Microsoft SQL Server\110\Tools\Binn\SQLCMD.EXE" -S .\SQL2012 -U sa -P Pas$w0rd! -i C:\Temp\express_backup_maintenance.sql
forfiles /P "C:\Temp" /S /M *.bak /D -7 /C "cmd /c del @path"

REM If you are using SQL Server 2016 and up, the path to SQLCMD.EXE is somewhere else:
REM C:\Program Files\Microsoft SQL Server\Client SDK\ODBC\130\Tools\Binn\SQLCMD.EXE