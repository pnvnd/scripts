# https://docs.newrelic.com/docs/data-apis/ingest-apis/event-api/introduction-event-api/#numbertwo
# https://docs.newrelic.com/docs/data-apis/ingest-apis/event-api/incident-event-rest-api#example-json

# Check if file exists, returns "True" or "False"
$file = "C:\\temp\\newrelic-infra.yml"
$exists = Test-Path -Path $file

# Use INGEST - LICENSE key
$insertkey = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXNRAL"
$accountId = "1234567"

# Create an event in a custom table

if ($exists -eq $true) {
#$lastModifiedDate = (Get-Item $file).LastWriteTime

$body = '{
    "eventType": "FileWatcher",
    "filepath": "' + $file + '",
    "exists": "' + $exists + '",
    "lastModifiedDate": "' + (Get-Item $file).LastWriteTime + '",
    "lastAccessDate": "' + (Get-Item $file).LastAccessTime + '",
    "creationDate": "' + (Get-Item $file).CreationTime + '",
    "fileSize (KB)": "' + (Get-Item $file).length/1KB + '",
    "userDomain": "' + $env:UserDomain + '",
    "computerName": "' + $env:ComputerName + '",
    "userName": "' + $env:UserName + '",
    "version": 1
}'
}
else {
$body = '{
    "eventType": "FileWatcher",
    "filepath": "' + $file + '",
    "exists": "' + $exists + '",
    "UserDomain": "' + $env:UserDomain + '",
    "ComputerName": "' + $env:ComputerName + '",
    "UserName": "' + $env:UserName + '",
    "version": 1
}'
}

$headers = @{}
$headers.Add("Api-Key", "$insertkey")
$headers.Add("Content-Encoding", "gzip")

$encoding = [System.Text.Encoding]::UTF8
$enc_data = $encoding.GetBytes($body)

$output = [System.IO.MemoryStream]::new()
$gzipStream = New-Object System.IO.Compression.GzipStream $output, ([IO.Compression.CompressionMode]::Compress)

$gzipStream.Write($enc_data, 0, $enc_data.Length)
$gzipStream.Close()
$gzipBody = $output.ToArray()

Invoke-WebRequest -Headers $headers -Method Post -Body $gzipBody "https://insights-collector.newrelic.com/v1/accounts/$accountId/events"
