$API_ENDPOINT="https://api.newrelic.com/graphql"
$API_KEY="NRAK-XXXXXXXXXXXXXXXXXXXXXXXXXXX"

# Example, this entity is for my "Chargeback" Synthetics Monitor
$ENTITY_GUID="MzI5MzE1N3xTWU5USHxNT05JVE9SfDAzMzBiNWU5LTgyNzgtNDliYy05N2UyLTBlZGU1ZWE2OTc4Mw"

# deploymentType can be: BASIC, BLUE_GREEN, CANARY, OTHER, ROLLING, SHADOW
$MUTATION= @{"query" = @"
  mutation {
    changeTrackingCreateDeployment(deployment: {
      changelog: "Powershell Example", 
      commit: "123456f", 
      deepLink: "https://github.com/pnvnd", 
      deploymentType: BASIC, 
      description: "Testing again", 
      entityGuid: "$ENTITY_GUID", 
      groupId: "123", 
      user: "peternguyen@newrleic.com", 
      version: "0.0.9"
    }) {
      changelog
      commit
      deepLink
      deploymentId
      deploymentType
      description
      groupId
      user
    }
  }
"@
} | ConvertTo-Json

Invoke-WebRequest -Uri $API_ENDPOINT `
-Method POST `
-Headers @{"Api-Key"=$API_KEY} `
-ContentType "application/json" `
-Body $MUTATION

# NRQL: SELECT count(*) FROM Deployment FACET entity.name