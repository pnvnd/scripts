# SearchAllTables
Search all columns of all tables in a MSSQL database for a keyword or number.

The original script by Narayana Vyas Kondreddi was a stored procedure.
This script was modified to run as a stand-alone script, and to search numerical values.

There are 3 variables that need input:

- @searchStr
- @exactMatch
- @dataType

##[@searchStr]
This is whatever you are searching for.  If searching for text, use single quotes.  
Example: DECLARE @searchStr varchar(100) = 'value'

If searching for numerical value, do not use single quotes.
Example: DECLARE @searchStr varchar(100) = 143.69

##[@exactMatch]
This is for text search only, otherwise the value is ignored for numerical search.
To find tables containing some text use DECLARE @exactMatch int = 0
To find tables containing EXACT match for text, use DECLARE @exactMatch int = 1


##[@dataType]
1. str for string of text
2. dec for decimal
3. int for interger
4. num for number

Numerical search has a slight bug for SQL 2014 and up.  If you get any error messages for numerical searches, ignore it and go to the Results tab.