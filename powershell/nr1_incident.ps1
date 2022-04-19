# https://docs.newrelic.com/docs/data-apis/ingest-apis/event-api/introduction-event-api/#numbertwo
# https://docs.newrelic.com/docs/data-apis/ingest-apis/event-api/incident-event-rest-api#example-json

# Check if file exists, returns "True" or "False"
$exists = Test-Path -Path "C:\temp\newrelic infra.yml"

if ($exists -eq $false) {
# Use INGEST - LICENSE key
$insertkey = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXNRAL"
$accountId = "1234567"

# Create an Incident under Alerts & AI
    $body = '[{
        "eventType": "NrAiIncidentExternal",
        "title": "File Unavailable",
        "description": "Task Scheduler unable to find C:\temp\newrelic infra.yml.",
        "state": "trigger",
        "source": "server-2019",
        "entityName": "testEntity",
        "entity.guid": "testEntity123",
        "aggregationTag.serviceId": 5,
        "aggregationTag.environment": "production",
        "aggregationTag.errorId": 143569,
        "tag.stackTrace": "some stack trace...",
        "version": 1
    }]'

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
}
else {
    Write-Host "Have a nice day!"
}

