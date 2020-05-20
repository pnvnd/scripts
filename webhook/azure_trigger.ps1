using namespace System.Net

# Input bindings are passed in via param block.
param($Request, $TriggerMetadata)
$accountId = "1234567"
$insertkey = "NRII-n3wr3l1c1n53r7k3yh3r3"

# Write to the Azure Functions log stream.
Write-Host "HTTP trigger function processed a request for Log alert for Log Analytics."

# Interact with query parameters or the body of the request.
$alertrulename = $Request.Query.alertrulename

if (-not $alertrulename) {
    $IncludeSearchResults = $Request.Body.includesearchresults
    $description = $Request.Body.description
    $alertrulename = $Request.Body.alertrulename
    $thresholdoperator = $Request.Body.thresholdoperator
    $thresholdvalue = $Request.Body.thresholdvalue
    $linktosearchresults = $Request.Body.linktosearchresults
    $searchresultcount = $Request.Body.searchresultcount
    $searchintervalendtimeutc = $Request.Body.searchintervalendtimeutc
    $searchintervalstarttimeutc = $Request.Body.searchintervalstarttimeutc
    $searchinterval = $Request.Body.searchinterval
    $searchintervalinseconds = $Request.Body.searchintervalinseconds
    $searchquery = $Request.Body.searchquery
    $alerttype = $Request.Body.alerttype
    $severity = $Request.Body.severity
    $workspaceid = $Request.Body.workspaceid
    $applicationid = $Request.Body.applicationid
    $subscriptionid = $Request.Body.subscriptionid
}

if ($alertrulename) {
    $status = [HttpStatusCode]::OK
    $body = '{
        "eventType": "Azure Alert",
        "IncludeSearchResults": false,
        "Description": "' + $description + '",
        "AlertRuleName": "' + $alertrulename + '",
        "AlertThresholdOperator": "' + $thresholdoperator + '",
        "AlertThresholdValue": "' + $thresholdvalue + '",
        "LinkToSearchResults": "' + $linktosearchresults + '",
        "ResultCount": "' + $searchresultcount + '",
        "SearchIntervalEndtime": "' + $searchintervalendtimeutc + '",
        "SearchIntervalStartTime": "' + $searchintervalstarttimeutc + '",
        "SearchInterval": "' + $searchinterval + '",
        "SearchIntervalInSeconds": "' + $searchintervalinseconds + '",
        "AlertType": "' + $alerttype + '",
        "Severity": "' + $severity + '",
        "WorkspaceID": "' + $workspaceid + '",
        "ApplicationID": "' + $applicationid + '",
        "SubscriptionID": "' + $subscriptionid + '"}'
}
else {
    $status = [HttpStatusCode]::BadRequest
    $body = "Bad Request"
}

# Associate values to output bindings by calling 'Push-OutputBinding'.
Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = $status
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