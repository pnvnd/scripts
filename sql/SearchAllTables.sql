-- Remove CREATE PROC to run search on demand
-- CREATE PROC SearchAllTables

-- Replace 'value' with whatever 'text' or number (no single quotes)
DECLARE @searchStr varchar(100) = 'value'

-- Use 1 to find exact matches (only used for text, otherwise value doesn't matter)
DECLARE @exactMatch int = 0

-- Choose dataType options from str, int, dec, or num.  If searching numerical values, ignore error messages and go to Results tab
DECLARE @dataType varchar(16) = 'str'

-- AS
-- BEGIN

-- Modified by: Peter Nguyen https://github.com/pnvnd/SearchAllTables
-- Tested with SQL Server: 2008, 2008 R2, 2012, 2014, 2017

-- Copyright © 2002 Narayana Vyas Kondreddi. All rights reserved.
-- Purpose: To search all columns of all tables for a given search string
-- Written by: Narayana Vyas Kondreddi
-- Site: http://vyaskn.tripod.com
-- Tested on: SQL Server 7.0 and SQL Server 2000
-- Date modified: 28th July 2002 22:50 GMT

-- Create a temporary table to select records out of when query complete
CREATE TABLE #Results
	(
		tableName nvarchar(64),
		columnName nvarchar(64),
		columnValue nvarchar(4000),
		searchStr nvarchar(64)
	)

-- Speed up query, remove this or SET NOCOUNT OFF to make query slower
SET NOCOUNT ON;

DECLARE
	@tableName nvarchar(256),
	@columnName nvarchar(128)

-- Text data type logic
IF @dataType = 'str'

BEGIN
	-- Find text containing searchStr, or exact match false
	IF @exactMatch = 0

	BEGIN
		DECLARE search CURSOR
		FOR
		-- Select columns in base tables where the data type is some kind of text
			SELECT tbl.TABLE_NAME, col.COLUMN_NAME
			FROM INFORMATION_SCHEMA.COLUMNS col
				INNER JOIN INFORMATION_SCHEMA.TABLES tbl
					ON col.TABLE_NAME = tbl.TABLE_NAME
			WHERE DATA_TYPE IN ('char', 'varchar', 'nchar', 'nvarchar')
				AND col.COLUMN_NAME <> 'DEX_ROW_ID'
				AND tbl.TABLE_TYPE = 'BASE TABLE'
			ORDER BY tbl.TABLE_NAME, col.COLUMN_NAME

		OPEN search
			FETCH NEXT FROM Search INTO @tableName, @columnName

			WHILE @@FETCH_STATUS = 0

				BEGIN

					DECLARE @sqlStmtStr1 varchar(1024)
					SET @sqlStmtStr1 = 'SELECT ''' + @tableName + ''', ''' + @columnName + ''', LEFT(' + @columnName + ', 3072), ''''  
										FROM ' + @tableName + ' WHERE ' + @columnName + ' LIKE ' + '''%' +  @searchStr  + '%'''
		
					IF @columnName IS NOT NULL
							BEGIN
								INSERT INTO #results EXEC (@sqlStmtStr1)
							END
				
			FETCH NEXT FROM Search INTO @tableName, @columnName
			END
		CLOSE search
		DEALLOCATE search
	END

	-- Find exact match for searchStr, exact match not false, query is faster if you know exactly what to look for
	ELSE IF @exactMatch <> 0

	BEGIN
		DECLARE search CURSOR
		FOR
		-- Select columns in base tables where the data type is some kind of text
			SELECT tbl.TABLE_NAME, col.COLUMN_NAME
			FROM INFORMATION_SCHEMA.COLUMNS col
				INNER JOIN INFORMATION_SCHEMA.TABLES tbl
					ON col.TABLE_NAME = tbl.TABLE_NAME
			WHERE DATA_TYPE IN ('char', 'varchar', 'nchar', 'nvarchar')
				AND col.COLUMN_NAME <> 'DEX_ROW_ID'
				AND tbl.TABLE_TYPE = 'BASE TABLE'
			ORDER BY tbl.TABLE_NAME, col.COLUMN_NAME

		OPEN search
			FETCH NEXT FROM Search INTO @tableName, @columnName

			WHILE @@FETCH_STATUS = 0

				BEGIN

					DECLARE @sqlStmtStr2 varchar(1024)
					SET @sqlStmtStr2 = 'SELECT ''' + @tableName + ''', ''' + @columnName + ''', LEFT(' + @columnName + ', 3072), ''''  
										FROM ' + @tableName + ' (NOLOCK) ' + ' WHERE ' + @columnName + ' = ' + '''' +  @searchStr  + ''''
		
					IF @columnName IS NOT NULL
							BEGIN
								INSERT INTO #results EXEC (@sqlStmtStr2)
							END
				
			FETCH NEXT FROM search INTO @tableName, @columnName
			END
		CLOSE search
		DEALLOCATE search
	END
END

-- Numerical data type logic
ELSE IF @dataType = 'int' OR @dataType = 'dec' OR @dataType = 'num'

-- This will match a number exactly
BEGIN
	DECLARE search CURSOR
	FOR
	-- Select columns in base tables where the data type is some kind of number
		SELECT tbl.TABLE_NAME, col.COLUMN_NAME
		FROM INFORMATION_SCHEMA.COLUMNS col
			INNER JOIN INFORMATION_SCHEMA.TABLES tbl
				ON col.TABLE_NAME = tbl.TABLE_NAME
		WHERE DATA_TYPE IN ('int', 'decimal', 'numeric')
			AND col.COLUMN_NAME <> 'DEX_ROW_ID'
			AND tbl.TABLE_TYPE = 'BASE TABLE'
		ORDER BY tbl.TABLE_NAME, col.COLUMN_NAME

	OPEN search
		FETCH NEXT FROM Search INTO @tableName, @columnName

		WHILE @@FETCH_STATUS = 0

			BEGIN
			-- This is buggy, not sure where error message is coming from for SQL 2014+
				DECLARE @sqlStmtStr3 nvarchar(2048)
				SET @sqlStmtStr3 = 'SELECT ''' + @tableName + ''', ''' + @columnName + ''', LEFT(' + @columnName + ', 3072), ''@sqlStmtStr3''  
									FROM ' + @tableName + ' (NOLOCK) ' + ' WHERE ' + @columnName + ' = ' + '' +  @searchStr  + ''
		
				IF @columnName IS NOT NULL
						BEGIN
							INSERT INTO #results EXEC (@sqlStmtStr3)
						END
				
		FETCH NEXT FROM search INTO @tableName, @columnName
		END
	CLOSE search
	DEALLOCATE search
END

SELECT DISTINCT tableName, columnName, columnValue FROM #results

-- Drop table so you can run search on demand again
DROP TABLE #results

-- Comment out last END since we don't want a stored procedure
-- END