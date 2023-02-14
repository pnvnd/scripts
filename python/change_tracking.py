# !pip install requests
import requests

endpoint = "https://api.newrelic.com/graphql"
headers = {"API-Key": "NRAK-XXXXXXXXXXXXXXXXXXXXXXXXXXX", "Content-Type": "application/json"}

# Example, this entity is for my "Chargeback" Synthetics Monitor
entityGuid = "MzI5MzE1N3xTWU5USHxNT05JVE9SfDAzMzBiNWU5LTgyNzgtNDliYy05N2UyLTBlZGU1ZWE2OTc4Mw"

# deploymentType can be: BASIC, BLUE_GREEN, CANARY, OTHER, ROLLING, SHADOW
change_tracking = """
mutation {
  changeTrackingCreateDeployment(deployment: {
    changelog: "Python deployment", 
    commit: "123456c", 
    deepLink: "https://github.com/pnvnd", 
    deploymentType: BASIC, 
    description: "Testing python change tracking", 
    entityGuid: "%s", 
    groupId: "123", 
    user: "peternguyen@newrelic.com", 
    version: "0.0.7"
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
""" % (entityGuid)

# Post request to GraphQL, payload is JSON
r = requests.post(endpoint, json={"query": change_tracking}, headers=headers)

# NRQL: SELECT count(*) FROM Deployment FACET entity.name