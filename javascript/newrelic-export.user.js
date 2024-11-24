// ==UserScript==
// @name         New Relic Data Export
// @namespace    http://newrelic.com
// @version      3.8.1
// @description  Send NerdGraph request with cookie and export results
// @author       Peter Nguyen
// @match        https://one.newrelic.com/*
// @match        https://one.eu.newrelic.com/*
// @icon         https://newrelic.com/favicon.ico
// @grant        none
// @downloadURL  https://github.com/pnvnd/scripts/raw/refs/heads/master/javascript/newrelic-export.user.js
// @updateURL    https://github.com/pnvnd/scripts/raw/refs/heads/master/javascript/newrelic-export.user.js
// ==/UserScript==

(function() {
    'use strict';

// Determine the NerdGraph endpoint based on the current URL
const nerdgraphEndpoint = window.location.host.includes('one.eu.newrelic.com')
    ? 'https://one.eu.newrelic.com/graphql'
    : 'https://one.newrelic.com/graphql';

/********************
 * Helper Functions *
 ********************/

// Function to get all cookies as a single string
function getCookies() {
    return document.cookie.split(';').map(cookie => cookie.trim()).join('; ');
}

// Function to convert JSON data to CSV format and trigger download
function downloadCSV(data, filename) {
    // Define the CSV delimiter and line terminator
    const delimiter = ',';
    const lineTerminator = '\n';

    // Extract column headers
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        headers.join(delimiter), // Header row
        ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(delimiter)) // Data rows
    ].join(lineTerminator);

    function replacer(key, value) {
        if (value === null) return '';
        return value;
    }

    // Convert CSV content to a Blob
    const csvBlob = new Blob([csvContent], { type: 'text/csv; charset=utf-8;' });

    // Create an anchor element and proceed with the download
    let a = document.createElement('a');
    a.href = URL.createObjectURL(csvBlob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to convert JSON data to an HTML file and trigger download using Plotly
function downloadHTML(data, filename) {
    // Extract headers from the keys of the first data object
    const headers = Object.keys(data[0]);
    const headerNames = headers.map(header => `<b>${header}</b>`);

    // Prepare data for Plotly table
    const tableValues = headers.map(header => data.map(row => row[header]));

    // Define the HTML structure
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Data</title>
    <script src="https://cdn.plot.ly/plotly-2.35.2.min.js" charset="utf-8"></script>
</head>
<body>
    <div id="tableDiv"></div>
    <script>
        const tableData = [{
            type: 'table',
            header: {
                values: ${JSON.stringify(headerNames)},
                align: "center",
                line: { width: 1, color: 'black' },
                fill: { color: "grey" },
                font: { family: "Arial", size: 12, color: "white" }
            },
            cells: {
                values: ${JSON.stringify(tableValues)},
                align: "center",
                line: { color: "black", width: 1 },
                fill: { color: ['white', 'lightgrey'] },
                font: { family: "Arial", size: 11, color: ["black"] }
            }
        }];
        Plotly.newPlot('tableDiv', tableData);
    </script>
</body>
</html>`;

    // Convert HTML content to a Blob
    const htmlBlob = new Blob([htmlContent], { type: 'text/html; charset=utf-8;' });

    // Create an anchor element and proceed with the download
    let a = document.createElement('a');
    a.href = URL.createObjectURL(htmlBlob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to convert epoch milliseconds to a human-readable date format
function epochToHumanReadable(epochMilliseconds) {
    const date = new Date(epochMilliseconds);
    return date.toLocaleString();
}

// Get New Relic accounts and organizations
async function getAccounts(cookie) {
    const nerdgraphQuery = `
        {
          actor {
          accounts {
            name
            id
          }
        }
      }
    `;

    try {
        const response = await fetch(nerdgraphEndpoint, {
            method: 'POST',
            headers: {
                'content-type': 'application/json; charset=utf-8',
                'cookie': cookie,
                'newrelic-requesting-services': 'platform'
            },
            body: JSON.stringify({
                query: nerdgraphQuery
            })
        });

        const nerdgraph = await response.json();
        return nerdgraph.data.actor.accounts;

    } catch (err) {
        console.log('Error: ' + err.message);
        return null;
    }
}

/********************
 * Export Functions *
 ********************/

// Function to get accounts and download the response as CSV
async function exportAccounts(cookie) {
    try {
        const accounts = await getAccounts(cookie);
        if (accounts) {
            downloadCSV(accounts, 'accounts.csv');
        } else {
            console.log('Failed to retrieve accounts.');
        }
    } catch (err) {
        console.log('Error: ' + err.message);
    }
}

// Function to make requests using fetch and download the response as CSV
async function exportEntities(cookie, tagKey="", domain="APM") {
    let allEntities = []; // Initialize an array to hold all entities
    let nextCursor = null; // Start with a null cursor
    try {
        // Continue fetching data until there is no nextCursor
        do {
            const nerdgraphQuery = `
                {
                  actor {
                    entitySearch(
                      query: "domain IN ('${domain}') AND reporting='true'"
                      options: {tagFilter: "${tagKey}"}
                    ) {
                      results(cursor: ${nextCursor ? JSON.stringify(nextCursor) : null}) {
                        entities {
                          guid
                          name
                          entityType
                          type
                          domain
                          tags {
                            key
                            values
                          }
                          account {
                            name
                            id
                          }
                        }
                        nextCursor
                      }
                    }
                  }
                }
            `;

            const response = await fetch(nerdgraphEndpoint, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                    'cookie': cookie,
                    'newrelic-requesting-services': 'platform'
                },
                body: JSON.stringify({
                    query: nerdgraphQuery
                })
            });

            const nerdgraph = await response.json();
            const results = nerdgraph.data.actor.entitySearch.results;

            // Process entities before appending them to allEntities array
            results.entities.forEach(entity => {
                // Use the ternary operator to handle entities both with and without tags
                const tags = entity.tags.length > 0 ? entity.tags : [{ key: "", values: [""] }];

                tags.forEach(tag => {
                    const flattenedEntity = {
                        AccountID: entity.account.id,
                        "Account Name": entity.account.name,
                        domain: entity.domain,
                        type: entity.type,
                        entityType: entity.entityType,
                        name: entity.name,
                        guid: entity.guid,
                        "New Relic Link": "https://one.newrelic.com/redirect/entity/" + entity.guid,
                        "tags.key": tag.key,
                        "tags.value": tag.values.join(', ')
                    };
                    // Add the flattened entity to the allEntities array
                    allEntities.push(flattenedEntity);
                });
            });

            // Update the cursor for the next iteration
            nextCursor = results.nextCursor;

        } while (nextCursor);

        // Once all data is collected, download it as CSV
        downloadCSV(allEntities, 'entities' + domain + '.csv');
    } catch (err) {
        console.log('Error: ' + err.message);
    }
}

// Get drop rules for every account
async function exportDropRules(cookie) {
    let allEntities = []; // Initialize an array to hold all entities
    const accounts = await getAccounts(cookie);
    if (!accounts) {
        console.log('Failed to retrieve accounts.');
        return;
    }
    for (const account of accounts) {
        try {
            const nerdgraphQuery = `
                query getDropRules($accountId: Int!){
                  actor {
                    account(id: $accountId) {
                      nrqlDropRules {
                        list {
                          rules {
                            createdBy
                            createdAt
                            nrql
                            description
                            creator {
                              name
                              email
                            }
                            id
                            action
                            source
                          }
                        }
                      }
                    }
                  }
                }
            `;

            const response = await fetch(nerdgraphEndpoint, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                    'cookie': cookie,
                    'newrelic-requesting-services': 'platform'
                },
                body: JSON.stringify({
                    query: nerdgraphQuery,
                    variables: { accountId: account.id }
                })
            });

            const nerdgraph = await response.json();
            const rules = nerdgraph.data.actor.account.nrqlDropRules.list.rules;

            // Process and flatten each rule before adding to allEntities array
            for (const rule of rules) {
                const flattenedRule = {
                    "Account ID": account.id,
                    "Account Name": account.name,
                    "Creator Email": rule.creator ? rule.creator.email : null,
                    "Creator Name": rule.creator ? rule.creator.name : null,
                    createdBy: rule.createdBy,
                    createdAt: rule.createdAt,
                    nrql: rule.nrql,
                    description: rule.description,
                    id: rule.id,
                    action: rule.action,
                    source: rule.source
                };
                allEntities.push(flattenedRule);
            }
        } catch (err) {
            console.log('Error fetching drop rules for account ' + account.id + ': ' + err.message);
        }
    }
    // Once all data is collected, download it as CSV
    if (allEntities.length > 0) {
        downloadCSV(allEntities, 'dropRules.csv');
    } else {
        console.log('No drop rules found.');
    }
}

// Function to export metric normalization rules and download the response as CSV
async function exportMetricNormalizationRules(cookie) {
    let allEntities = []; // Initialize an array to hold all entities
    const accounts = await getAccounts(cookie);
    if (!accounts) {
        console.log('Failed to retrieve accounts.');
        return;
    }
    for (const account of accounts) {
        try {
            const nerdgraphQuery = `
                query getMetricNormalizationRules($accountId: Int!){
                  actor {
                    account(id: $accountId) {
                      metricNormalization {
                        metricNormalizationRules {
                          id
                          enabled
                          createdAt
                          applicationName
                          applicationGuid
                          action
                          evalOrder
                          notes
                          replacement
                          terminateChain
                          matchExpression
                        }
                      }
                    }
                  }
                }
            `;
            const response = await fetch(nerdgraphEndpoint, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                    'cookie': cookie,
                    'newrelic-requesting-services': 'platform'
                },
                body: JSON.stringify({
                    query: nerdgraphQuery,
                    variables: { accountId: account.id }
                })
            });
            const nerdgraph = await response.json();
            const rules = nerdgraph.data.actor.account.metricNormalization.metricNormalizationRules;

            // Process and flatten each rule before adding to allEntities array
            for (const rule of rules) {
                const flattenedRule = {
                    "Account ID": account.id,
                    "Account Name": account.name,
                    id: rule.id,
                    enabled: rule.enabled,
                    createdAt: epochToHumanReadable(rule.createdAt), // Convert epoch to human-readable format
                    applicationName: rule.applicationName,
                    applicationGuid: rule.applicationGuid,
                    action: rule.action,
                    evalOrder: rule.evalOrder,
                    notes: rule.notes,
                    replacement: rule.replacement,
                    terminateChain: rule.terminateChain,
                    matchExpression: rule.matchExpression
                };
                allEntities.push(flattenedRule);
            }

        } catch (err) {
            console.log('Error fetching metric normalization rules for account ' + account.id + ': ' + err.message);
        }
    }
    // Once all data is collected, download it as CSV
    if (allEntities.length > 0) {
        downloadCSV(allEntities, 'metricNormalizationRules.csv');
    } else {
        console.log('No metric normalization rules found.');
    }
}

// Function to make requests using fetch and download the response as CSV
async function exportSyntheticScripts(cookie) {
    let allEntities = [];
    let nextCursor = null;
    try {
        // Step 1: Run the first GraphQL query to get Synthetic Monitor details
        do {
            const nerdgraphQuery = `
                query getSyntheticMonitors($nextCursor: String){
                  actor {
                    entitySearch(queryBuilder: {domain: SYNTH, type: MONITOR}) {
                      results(cursor: $nextCursor) {
                        entities {
                          ... on SyntheticMonitorEntityOutline {
                            accountId
                            guid
                            name
                            monitorType
                            monitoredUrl
                            period
                            monitorSummary {
                              status
                            }
                            account {
                              name
                            }
                          }
                        }
                        nextCursor
                      }
                    }
                  }
                }
            `;

            const response = await fetch(nerdgraphEndpoint, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                    'cookie': cookie,
                    'newrelic-requesting-services': 'platform'
                },
                body: JSON.stringify({
                    query: nerdgraphQuery,
                    variables: { nextCursor }
                })
            });

            const nerdgraph = await response.json();
            //const initialResults = initialData.data.actor.entitySearch.results;
            nextCursor = nerdgraph.data.actor.entitySearch.results.nextCursor;

            // Process each entity to fetch the script text if monitorType is SCRIPT_BROWSER or SCRIPT_API
            for (const entity of nerdgraph.data.actor.entitySearch.results.entities) {
                //const accountId = entity.accountId;
                //const accountName = entity.account.name;
                //const monitorGuid = entity.guid;

                if (entity.monitorType === "SCRIPT_BROWSER" || entity.monitorType === "SCRIPT_API") {
                    // Step 2: Run the second GraphQL query for each accountId and guid
                    const scriptQuery = `
                        query exportSyntheticScript($accountId: Int!, $monitorGuid: EntityGuid!) {
                          actor {
                            account(id: $accountId) {
                              synthetics {
                                script(monitorGuid: $monitorGuid) {
                                  text
                                }
                              }
                            }
                          }
                        }
                    `;

                    const scriptResponse = await fetch(nerdgraphEndpoint, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json; charset=utf-8',
                            'cookie': cookie,
                            'newrelic-requesting-services': 'platform'
                        },
                        body: JSON.stringify({
                            query: scriptQuery,
                            variables: { accountId: entity.accountId, monitorGuid: entity.guid }
                        })
                    });

                    const scriptData = await scriptResponse.json();
                    //const scriptText = scriptData.data.actor.account.synthetics.script?.text || "N/A";

                    // Flatten the entity and script data
                    const flattenedEntity = {
                        accountName: entity.account.name,
                        accountId: entity.accountId,
                        guid: entity.guid,
                        name: entity.name || "N/A",
                        monitorType: entity.monitorType || "N/A",
                        monitoredUrl: entity.monitoredUrl || "N/A",
                        period: entity.period || "N/A",
                        monitorStatus: entity.monitorSummary.status || "N/A",
                        text: scriptData.data.actor.account.synthetics.script?.text || "N/A"
                    };
                    allEntities.push(flattenedEntity);
                } else {
                    // Flatten the entity data with text as "N/A" when monitorType is not SCRIPT_BROWSER or SCRIPT_API
                    const flattenedEntity = {
                        accountName: entity.account.name,
                        accountId: entity.accountId,
                        guid: entity.guid,
                        name: entity.name || "N/A",
                        monitorType: entity.monitorType || "N/A",
                        monitoredUrl: entity.monitoredUrl || "N/A",
                        period: entity.period || "N/A",
                        monitorStatus: entity.monitorSummary.status || "N/A",
                        text: "N/A"
                    };
                    allEntities.push(flattenedEntity);
                }
            }

            // Update the cursor for the next iteration
            // cursor = initialResults.nextCursor;

        } while (nextCursor);

        // Once all data is collected, download it as CSV
        downloadCSV(allEntities, 'syntheticMonitors.csv');
    } catch (err) {
        console.log('Error: ' + err.message);
    }
}

async function exportNrqlConditions(cookie) {
    try {
        // Use your existing function to get account IDs
        const accounts = await getAccounts(cookie);

        let allConditions = [];

        for (const account of accounts) {
            const accountId = account.id;
            const accountName = account.name;
            let nextPolicyCursor = null;

            do {
                const policiesQuery = `
                    query getPolicies($accountId: Int!, $cursor: String) {
                      actor {
                        account(id: $accountId) {
                          alerts {
                            policiesSearch(cursor: $cursor) {
                              policies {
                                accountId
                                id
                                name
                              }
                              nextCursor
                              totalCount
                            }
                          }
                        }
                      }
                    }
                `;

                const policiesResponse = await fetch(nerdgraphEndpoint, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json; charset=utf-8',
                        'cookie': cookie,
                        'newrelic-requesting-services': 'platform'
                    },
                    body: JSON.stringify({
                        query: policiesQuery,
                        variables: {
                            accountId: accountId,
                            cursor: nextPolicyCursor
                        }
                    })
                });

                const policiesData = await policiesResponse.json();
                const policies = policiesData.data.actor.account.alerts.policiesSearch.policies;
                nextPolicyCursor = policiesData.data.actor.account.alerts.policiesSearch.nextCursor;

                for (const policy of policies) {
                    const policyId = policy.id;
                    let nextConditionCursor = null;
                    let conditionsFound = false;

                    do {
                        const conditionsQuery = `
                            query getNrqlConditions($accountId: Int!, $policyId: ID, $cursor: String) {
                              actor {
                                account(id: $accountId) {
                                  alerts {
                                    nrqlConditionsSearch(searchCriteria: {policyId: $policyId}, cursor: $cursor) {
                                      nextCursor
                                      nrqlConditions {
                                        enabled
                                        name
                                        id
                                        policyId
                                        signal {
                                          aggregationDelay
                                          aggregationMethod
                                          aggregationTimer
                                          aggregationWindow
                                          evaluationDelay
                                          fillOption
                                          fillValue
                                          slideBy
                                        }
                                        runbookUrl
                                        createdAt
                                        createdBy {
                                          name
                                          email
                                        }
                                        entityGuid
                                        terms {
                                          operator
                                          priority
                                          threshold
                                          thresholdDuration
                                          thresholdOccurrences
                                        }
                                        description
                                        nrql {
                                          query
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                        `;

                        const conditionsResponse = await fetch(nerdgraphEndpoint, {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json; charset=utf-8',
                                'cookie': cookie,
                                'newrelic-requesting-services': 'platform'
                            },
                            body: JSON.stringify({
                                query: conditionsQuery,
                                variables: {
                                    accountId: accountId,
                                    policyId: policyId,
                                    cursor: nextConditionCursor
                                }
                            })
                        });

                        const conditionsData = await conditionsResponse.json();
                        const conditions = conditionsData.data.actor.account.alerts.nrqlConditionsSearch.nrqlConditions;
                        nextConditionCursor = conditionsData.data.actor.account.alerts.nrqlConditionsSearch.nextCursor;

                        if (conditions.length > 0) {
                            conditionsFound = true;
                        }

                        for (const condition of conditions) {
                            if (condition.terms.some(term => term.priority === "CRITICAL")) {
                                allConditions.push({
                                    accountName: accountName,
                                    accountId: accountId,
                                    policyName: policy.name,
                                    policyId: policy.id,
                                    conditionId: condition.id,
                                    createdAt: epochToHumanReadable(condition.createdAt) || "N/A",
                                    "createdBy.name": condition.createdBy?.name || "N/A",
                                    "createdBy.email": condition.createdBy?.email || "N/A",
                                    description: condition.description || "N/A",
                                    enabled: condition.enabled,
                                    entityGuid: condition.entityGuid || "N/A",
                                    "nrql.query": condition.nrql.query || "N/A",
                                    runbookUrl: condition.runbookUrl || "N/A",
                                    "signal.aggregationDelay": condition.signal.aggregationDelay || "N/A",
                                    "signal.aggregationMethod": condition.signal.aggregationMethod || "N/A",
                                    "signal.aggregationTimer": condition.signal.aggregationTimer || "N/A",
                                    "signal.aggregationWindow": condition.signal.aggregationWindow || "N/A",
                                    "signal.evaluationDelay": condition.signal.evaluationDelay || "N/A",
                                    "signal.fillOption": condition.signal.fillOption || "N/A",
                                    "signal.fillValue": condition.signal.fillValue || "N/A",
                                    "signal.slideBy": condition.signal.slideBy || "N/A",
                                    "terms.operator": condition.terms[0].operator || "N/A",
                                    "terms.priority": condition.terms[0].priority || "N/A",
                                    "terms.threshold": condition.terms[0].threshold || "N/A",
                                    "terms.thresholdDuration": condition.terms[0].thresholdDuration || "N/A",
                                    "terms.thresholdOccurrences": condition.terms[0].thresholdOccurrences || "N/A"
                                });
                            }
                        }
                    } while (nextConditionCursor);

                    if (!conditionsFound) {
                        allConditions.push({
                            accountName: accountName,
                            accountId: accountId,
                            policyName: policy.name,
                            policyId: policy.id,
                            conditionId: "N/A",
                            createdAt: "N/A",
                            "createdBy.name": "N/A",
                            "createdBy.email": "N/A",
                            description: "N/A",
                            enabled: "N/A",
                            entityGuid: "N/A",
                            "nrql.query": "N/A",
                            runbookUrl: "N/A",
                            "signal.aggregationDelay": "N/A",
                            "signal.aggregationMethod": "N/A",
                            "signal.aggregationTimer": "N/A",
                            "signal.aggregationWindow": "N/A",
                            "signal.evaluationDelay": "N/A",
                            "signal.fillOption": "N/A",
                            "signal.fillValue": "N/A",
                            "signal.slideBy": "N/A",
                            "terms.operator": "N/A",
                            "terms.priority": "N/A",
                            "terms.threshold": "N/A",
                            "terms.thresholdDuration": "N/A",
                            "terms.thresholdOccurrences": "N/A"
                        });
                    }
                }
            } while (nextPolicyCursor);
        }

        // Convert allConditions to CSV and trigger download
        downloadCSV(allConditions, 'nrqlAlertConditions.csv');
    } catch (err) {
        console.log('Error: ' + err.message);
    }
}

// Function to export metric normalization rules and download the response as HTML
async function exportGraphQLToHTML(cookie, accountId) {
    const nerdgraphQuery = `
        query getNrqlQuery($accountId: Int!) {
          actor {
            account(id: $accountId) {
              monitor1: nrql(query:
                """
SELECT sum(consumption) AS 'CCUs Used'
FROM NrConsumption
WHERE metric = 'CoreCCU'
FACET dimension_productCapability AS 'Dimension Product Capability'
SINCE LAST MONTH UNTIL THIS MONTH
LIMIT MAX
                """, timeout: 90) {
                results
              }
            }
          }
        }
    `;

    try {
        const response = await fetch(nerdgraphEndpoint, {
            method: 'POST',
            headers: {
                'content-type': 'application/json; charset=utf-8',
                'cookie': cookie,
                'newrelic-requesting-services': 'platform'
            },
            body: JSON.stringify({
                query: nerdgraphQuery,
                variables: { accountId: accountId }
            })
        });

        const nerdgraph = await response.json();
        const results = nerdgraph.data.actor.account.monitor1.results;

        if (results && results.length > 0) {
            downloadHTML(results, 'nrqlResults.html');
        } else {
            console.log('No data returned from the query.');
        }
    } catch (err) {
        console.log('Error fetching GraphQL data: ' + err.message);
    }
}

/***********************
 * Front-end Functions *
 ***********************/

// Available functions for exporting data
const exportFunctions = {
    "Accounts": exportAccounts,
    "Entities": exportEntities,
    "Drop Rules": exportDropRules,
    "Metric Normalization Rules": exportMetricNormalizationRules,
    "Synthetic Monitors & Scripts": exportSyntheticScripts,
    "NRQL Alert Policies & Conditions": exportNrqlConditions,
    "CCU Report": exportGraphQLToHTML,
};

// Function to create and add a dropdown menu and button to the webpage
function addExportControls() {
    // Create the dropdown menu for export functions
    const select = document.createElement('select');
    select.id = 'exportFunctionSelect';
    for (const [name,] of Object.entries(exportFunctions)) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    }
    // Style for the dropdown menu
    select.style.fontSize = '13px';
    select.style.padding = '5px';
    select.style.marginRight = '5px';
    select.style.backgroundColor = '#3A444B';
    select.style.border = 'none';
    select.style.color = 'white';
    select.style.borderRadius = '4px';

    // Create the dropdown menu for domains (initially hidden)
    const domainSelect = document.createElement('select');
    domainSelect.id = 'domainSelect';
    domainSelect.style.display = 'none'; // Hide the domain dropdown menu by default
    const domains = ["APM", "BROWSER", "EXT", "INFRA", "MOBILE", "SYNTH"];
    domains.forEach(domain => {
        const option = document.createElement('option');
        option.value = domain;
        option.textContent = domain;
        domainSelect.appendChild(option);
    });
    // Style for the domain dropdown menu
    domainSelect.style.fontSize = '13px';
    domainSelect.style.padding = '5px';
    domainSelect.style.marginRight = '5px';
    domainSelect.style.backgroundColor = '#3A444B';
    domainSelect.style.border = 'none';
    domainSelect.style.color = 'white';
    domainSelect.style.borderRadius = '4px';

    // Create the button
    const button = document.createElement('button');
    button.id = 'exportButton';
    button.textContent = 'Export Data';

    // Style the button
    button.style.fontSize = '13px';
    button.style.padding = '5px 10px';
    button.style.backgroundColor = '#0D74DF';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';

    // Create the tag key input field
    const tagKeyInput = document.createElement('input');
    tagKeyInput.id = 'tagKeyInput';
    tagKeyInput.placeholder = 'Enter a tag key...';
    tagKeyInput.style.display = 'none'; // Hide input field by default

    // Match input field style with the dropdown and button
    tagKeyInput.style.fontSize = '13px';
    tagKeyInput.style.padding = '5px';
    tagKeyInput.style.marginRight = '5px';
    tagKeyInput.style.backgroundColor = '#3A444B';
    tagKeyInput.style.border = 'none';
    tagKeyInput.style.color = 'white';
    tagKeyInput.style.borderRadius = '4px';

    // Create the account ID input field (initially hidden)
    const accountIdInput = document.createElement('input');
    accountIdInput.id = 'accountIdInput';
    accountIdInput.type = 'number';
    accountIdInput.placeholder = 'Enter Account ID...';
    accountIdInput.style.display = 'none'; // Hide input field by default

    // Match input field style with the dropdown and button
    accountIdInput.style.fontSize = '13px';
    accountIdInput.style.padding = '5px';
    accountIdInput.style.marginRight = '5px';
    accountIdInput.style.backgroundColor = '#3A444B';
    accountIdInput.style.border = 'none';
    accountIdInput.style.color = 'white';
    accountIdInput.style.borderRadius = '4px';

    // Create a wrapper div to hold the controls
    const controlsDiv = document.createElement('div');
    controlsDiv.id = 'exportControls';
    controlsDiv.style.position = 'fixed';
    controlsDiv.style.top = '15px';
    controlsDiv.style.left = '50%';
    controlsDiv.style.transform = 'translateX(-50%)';
    controlsDiv.style.zIndex = 1000;

    // Update the change event of the export function dropdown to show/hide input field and domain dropdown
    select.addEventListener('change', (e) => {
        if (e.target.value === "Entities") {
            tagKeyInput.style.display = 'inline'; // Show the tag key input field
            domainSelect.style.display = 'inline'; // Show the domain dropdown menu
            accountIdInput.style.display = 'none'; // Hide the account ID input field
        } else if (e.target.value === "CCU Report") {
            accountIdInput.style.display = 'inline'; // Show the account ID input field
            tagKeyInput.style.display = 'none'; // Hide the tag key input field
            domainSelect.style.display = 'none'; // Hide the domain dropdown menu
        } else {
            tagKeyInput.style.display = 'none'; // Hide the tag key input field
            domainSelect.style.display = 'none'; // Hide the domain dropdown menu
            accountIdInput.style.display = 'none'; // Hide the account ID input field
        }
    });

    // Update the change event of the domain dropdown to set the default tagKey
    domainSelect.addEventListener('change', (e) => {
        if (e.target.value === "SYNTH" && !tagKeyInput.value) {
            tagKeyInput.value = 'secureCredential';
        }
    });

// Modify the click event of the button to include the tag key in the function call
button.addEventListener('click', async () => {
    const selectedFunctionName = select.value;
    const exportFunction = exportFunctions[selectedFunctionName];
    const selectedDomain = domainSelect.value;
    if (exportFunction) {
        startExportProgress(button);
        try {
            let cookie = getCookies(); // getCookies is assumed to return the necessary cookies
            if (selectedFunctionName === "Entities") {
                const tagKey = tagKeyInput.value || 'appid';
                await exportFunction(cookie, tagKey, selectedDomain);
            } else if (selectedFunctionName === "CCU Report") {
                const accountId = parseInt(accountIdInput.value); // Ensure accountId is a number
                if (accountId) {
                    await exportFunction(cookie, accountId);
                } else {
                    alert('Please enter a valid Account ID');
                }
            } else {
                await exportFunction(cookie, selectedDomain);
            }
            resetExportButton(button);
        } catch (error) {
            console.error('Export failed:', error);
            resetExportButton(button);
            alert(`Export failed: ${error.message}`);
        }
    } else {
        alert('Selected function is not defined');
    }
});


    // Add the dropdown menus, input fields, and button to the wrapper
    controlsDiv.appendChild(select);
    controlsDiv.appendChild(domainSelect);
    controlsDiv.appendChild(tagKeyInput);
    controlsDiv.appendChild(accountIdInput);
    controlsDiv.appendChild(button);

    // Add the controls to the webpage
    document.body.appendChild(controlsDiv);
}

function startExportProgress(button) {
    button.disabled = true; // Disable the button while exporting
    button.style.backgroundColor = '#3A444B'; // Change color to gray
    button.style.cursor = 'default'; // Change cursor to default to indicate lack of interactivity
    button.textContent = 'Exporting...'; // Change button text to indicate exporting
}

function resetExportButton(button) {
    button.disabled = false; // Re-enable the button
    button.style.backgroundColor = '#0D74DF'; // Reset the background color to original
    button.style.cursor = 'pointer'; // Reset the cursor to pointer
    button.textContent = 'Export Data'; // Reset button text to "Export Data"
}

// Initialize the controls
addExportControls();

})();
