using namespace System.Net

# Input bindings are passed in via param block.
param($Request, $TriggerMetadata)
$accountId = "1234567"
$insertkey = "NRII-n3wr3l1c1n53r7k3yh3r3"

# Write to the Azure Functions log stream.
Write-Host "HTTP trigger function processed a request for Statuspage Component Update"

# Interact with query parameters or the body of the request.
$component = $Request.Query.component

if (-not $component) {
    $component = $Request.Body.component
    $status = $Request.Body.component.status
    $name = $Request.Body.component.name
    $created_at = $Request.Body.component.created_at
    $updated_at = $Request.Body.component.updated_at
    $position = $Request.Body.component.position
    $description = $Request.Body.component.description
    $showcase = $Request.Body.component.showcase
    $id = $Request.Body.component.id
    $page_id = $Request.Body.component.page_id
    $group_id = $Request.Body.component.group_id
}

if ($component) {
    $statuscode = [HttpStatusCode]::OK
    $body = '{
            "eventType": "Statuspage",
            "Name": "' + $name + '",
            "Status": "' + $status + '",
            "Created At": "' + $created_at + '",
            "Updated At": "' + $updated_at + '",
            "Position": "' + $position + '",
            "Description": "' + $description + '",
            "Showcase": "' + $showcase + '",
            "ID": "' + $id + '",
            "PageID": "' + $page_id + '",
            "GroupID": "' + $group_id + '"
    }'
}
else {
    $statuscode = [HttpStatusCode]::BadRequest
    $body = "Bad Request"
}

# Associate values to output bindings by calling 'Push-OutputBinding'.
Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = $statuscode
    Body = $body
})

$headers = @{} 
$headers.Add("X-Insert-Key", "$insertkey") 
$headers.Add("Content-Encoding", "gzip")


$encoding = [System.Text.Encoding]::UTF8
$enc_data = $encoding.GetBytes($body)

$output = [System.IO.MemoryStream]::new()
$gzipStream = New-Object System.IO.Compression.GzipStream $output, ([IO.Compression.CompressionMode]::Compress)

$gzipStream.Write($enc_data, 0, $enc_data.Length)
$gzipStream.Close()
$gzipBody = $output.ToArray()

Invoke-WebRequest -Headers $headers -Method Post -Body $gzipBody  "https://insights-collector.newrelic.com/v1/accounts/$accountId/events"