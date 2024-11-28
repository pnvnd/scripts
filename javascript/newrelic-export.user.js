// ==UserScript==
// @name         New Relic Data Export
// @namespace    http://newrelic.com
// @version      4.0.6
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

// Function to create and add toaster notifications to the webpage
function addToasterStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .toaster {
            position: fixed;
            bottom: 10px;
            right: 10px;
            width: 300px;
            padding: 15px;
            border-radius: 5px;
            color: white;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            margin-bottom: 5px; /* Reduce space between toasters */
        }
        .toaster.error {
            background-color: #D32F2F;
        }
        .toaster.success {
            background-color: #4CAF50;
        }
        .toaster .close-btn {
            position: absolute;
            top: 5px;
            right: 10px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
}

// Function to create a toaster
function createToaster(message, type = 'error') {
    const toaster = document.createElement('div');
    toaster.className = `toaster ${type}`;
    toaster.innerHTML = `
        <span>${message}</span>
        <span class="close-btn">x</span>
    `;

    toaster.querySelector('.close-btn').addEventListener('click', () => {
        document.body.removeChild(toaster);
        adjustToasterPositions();
    });

    document.body.appendChild(toaster);
    adjustToasterPositions(); // Adjust positions after adding the new toaster
}

// Function to adjust the position of existing toasters
function adjustToasterPositions() {
    const toasters = document.querySelectorAll('.toaster');
    let bottomOffset = 10; // Initial bottom offset
    toasters.forEach((toaster) => {
        toaster.style.bottom = `${bottomOffset}px`;
        bottomOffset += toaster.offsetHeight + 5; // Update bottom offset with toaster height and reduced margin
    });
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
            createToaster('Accounts exported successfully!', 'success');
        } else {
            createToaster('Failed to retrieve accounts.');
        }
    } catch (err) {
        createToaster(`Error: ${err.message}`);
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
        createToaster(domain + ' Entities exported successfully!', 'success');
    } catch (err) {
        createToaster(`Error: ${err.message}`);
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
        createToaster('Drop Rules exported successfully!', 'success');
    } else {
        createToaster(`Error: No drop rules found`);
    }
}

// Function to export metric normalization rules and download the response as CSV
async function exportMetricNormalizationRules(cookie) {
    let allEntities = []; // Initialize an array to hold all entities
    const accounts = await getAccounts(cookie);
    if (!accounts) {
        createToaster(`Error: Failed to retrieve accounts.`);
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
            createToaster('Error fetching metric normalization rules for account ' + account.id + ': ' + err.message);
        }
    }
    // Once all data is collected, download it as CSV
    if (allEntities.length > 0) {
        downloadCSV(allEntities, 'metricNormalizationRules.csv');
        createToaster('Metric Normalization Rules exported successfully!', 'success');
    } else {
        createToaster('No metric normalization rules found.');
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
        } while (nextCursor);

        // Once all data is collected, download it as CSV
        downloadCSV(allEntities, 'syntheticMonitors.csv');
        createToaster('Synthetic Monitor and Scripts exported successfully!', 'success');
    } catch (err) {
        createToaster(`Error: ${err.message}`);
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

                        if (conditionsData.errors) {
                            createToaster(`Error fetching conditions for policy ID ${policyId}: ${conditionsData.errors[0].message}`);
                            nextConditionCursor = null; // Set cursor to null to exit the loop

                            // Add a placeholder entry with N/A for fields that couldn't be fetched
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

                            continue;
                        }

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
        createToaster('NRQL Alert Conditions exported successfully!', 'success');
    } catch (err) {
        createToaster(`Error: ${err.message}`);
    }
}

async function exportGraphQLToHTML(cookie, accountId) {
    const nerdgraphQuery = `
    query getNrqlQuery($accountId: Int!) {
      actor {
        account(id: $accountId) {
          ingest: nrql(
            timeout: 90
            query: """
            SELECT sum(GigabytesIngested) AS 'Data Ingested'
            FROM NrConsumption
            WHERE productLine = 'DataPlatform'
            AND (version = '0.4.2' OR nr.customerStructure='customer_contract')
            AND consumingAccountId IS NOT NULL
            FACET consumingAccountName, monthOf(timestamp), usageMetric
            SINCE '2023-10-01 00:00:00'
            LIMIT MAX
            """
          ) {
            results
          }
          users: nrql(
            timeout: 90
            query: """
            SELECT latest(consumption)
            FROM NrConsumption
            WHERE metric IN ('BasicUsers', 'FullPlatformUsers', 'CoreUsers')
            FACET metric, monthOf(timestamp)
            SINCE '2023-10-01 00:00:00'
            LIMIT MAX
            """
          ) {
            results
          }
          compute: nrql(
            timeout: 90
            query: """
            SELECT sum(consumption) AS 'CCUs'
            FROM NrConsumption
            WHERE metric IN ('CCU', 'CoreCCU')
            AND dimension_productCapability != 'Synthetics'
            AND dimension_computeType != 'Entity Writes'
            AND dimension_computeType != 'Entity Lookups'
            AND dimension_computeType != 'Entity Relationships'
            SINCE '2023-10-01 00:00:00'
            FACET dimension_productCapability, monthOf(timestamp)
            LIMIT MAX
            """
          ) {
            results
          }
          enr: nrql(
            timeout: 90
            query: """
            SELECT sum(consumption + ignoredConsumption) AS 'CCUs Used'
            FROM NrConsumption
            WHERE metric IN ('CCU', 'UnbilledCCU', 'CoreCCU')
            AND (dimension_computeType IN ('Entity Writes', 'Entity Lookups', 'Entity Relationships')
            OR dimension_productCapability IN ('ENTITIES_AND_RELATIONSHIPS', 'Entities & Relationships'))
            SINCE '2024-05-01'
            FACET monthOf(timestamp)
            LIMIT MAX
            """
          ) {
            results
          }
          synthetics: nrql(
            timeout: 90
            query: """
            SELECT sum(consumption + ignoredConsumption) AS 'CCUs Used'
            FROM NrConsumption
            WHERE metric IN ('CCU', 'UnbilledCCU', 'CoreCCU')
            AND dimension_productCapability = 'Synthetics'
            AND dimension_computeType != 'Entity Writes'
            AND dimension_computeType != 'Entity Lookups'
            AND dimension_computeType != 'Entity Relationships'
            SINCE '2024-09-01'
            FACET monthOf(timestamp)
            LIMIT MAX
            """
          ) {
            results
          }
          core: nrql(
            timeout: 90
            query: """
            FROM NrConsumption
            SELECT sum(consumption + ignoredConsumption) AS 'CCUs Used'
            WHERE metric IN ('CCU', 'UnbilledCCU', 'CoreCCU')
            SINCE '2024-08-01'
            FACET monthOf(timestamp)
            LIMIT MAX
            """
          ) {
            results
          }
          advanced: nrql(
            timeout: 90
            query: """
            SELECT sum(consumption) AS 'CCUs Used'
            FROM NrConsumption
            WHERE metric IN ('AdvancedCCU', 'CCU')
            AND (dimension_dataCategory = 'LiveArchive' OR dimension_productCapability = 'IAST')
            SINCE '2024-04-01'
            FACET monthOf(timestamp)
            LIMIT MAX
            """
          ) {
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

        const ingestResults = nerdgraph?.data?.actor?.account?.ingest?.results || [];
        const userResults = nerdgraph?.data?.actor?.account?.users?.results || [];
        const computeResults = nerdgraph?.data?.actor?.account?.compute?.results || [];
        const enrResults = nerdgraph?.data?.actor?.account?.enr?.results || [];
        const syntheticsResults = nerdgraph?.data?.actor?.account?.synthetics?.results || [];
        const coreResults = nerdgraph?.data?.actor?.account?.core?.results || [];
        const advancedResults = nerdgraph?.data?.actor?.account?.advanced?.results || [];

        if (ingestResults.length === 0) {
            throw new Error('No results returned from the query.');
        }

        const ingest = ingestResults.map(row => ({
            "Month of timestamp": row.facet[1],
            "Metric": row.facet[2],
            "Consuming Account Name": row.facet[0],
            "Data Ingested": row["Data Ingested"]
        }));

        const users = userResults.reduce((acc, row) => {
            const [userType, month] = row.facet;
            if (!acc[month]) acc[month] = { "Month of timestamp": month, "Total Users": 0 };
            acc[month][userType] = row["latest.consumption"];
            acc[month]["Total Users"] += row["latest.consumption"];
            return acc;
        }, {});

        const usersTableData = Object.values(users).sort((a, b) => new Date(b["Month of timestamp"]) - new Date(a["Month of timestamp"]));

        const compute = computeResults.reduce((acc, row) => {
            const [capability, month] = row.facet;
            if (!acc[month]) acc[month] = { "Month of timestamp": month, "Legacy CCUs": 0, "Alert CCUs": 0, "Dashboard CCUs": 0 };

            // Add the capability's CCUs separately
            acc[month][capability] = row.CCUs;

            // Aggregate the CCUs for Alert and Dashboard
            if (capability === "Alert Conditions" || capability === "Alerts") {
                acc[month]["Alert CCUs"] += row.CCUs;
            } else if (capability === "Dashboards") {
                acc[month]["Dashboard CCUs"] += row.CCUs;
            }

            // Aggregate all CCUs into Legacy CCUs
            acc[month]["Legacy CCUs"] += row.CCUs;

            return acc;
        }, {});

        // Sort the months in descending order
        const computeTableData = Object.values(compute).sort((a, b) => new Date(b["Month of timestamp"]) - new Date(a["Month of timestamp"]));

        const enr = enrResults.map(row => ({
            "Month of timestamp": row.facet,
            "CCUs Used": row["CCUs Used"]
        }));

        const synthetics = syntheticsResults.map(row => ({
            "Month of timestamp": row.facet,
            "CCUs Used": row["CCUs Used"]
        }));

        const core = coreResults.map(row => ({
            "Month of timestamp": row.facet,
            "CCUs Used": row["CCUs Used"]
        }));

        const advanced = advancedResults.map(row => ({
            "Month of timestamp": row.facet,
            "CCUs Used": row["CCUs Used"]
        }));

        if (ingest.length > 0 || usersTableData.length > 0 || computeTableData.length > 0 || enr.length > 0 || synthetics.length > 0 || core.length > 0 || advanced.length > 0) {
            const combinedData = {
                ingest: ingest.length > 0 ? ingest : [],
                users: usersTableData.length > 0 ? usersTableData : [],
                compute: computeTableData.length > 0 ? computeTableData : [],
                enr: enr.length > 0 ? enr : [],
                synthetics: synthetics.length > 0 ? synthetics : [],
                core: core.length > 0 ? core : [],
                advanced: advanced.length > 0 ? advanced : []
            };

            // Get the current date
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

            // Construct the filename
            const filename = `${formattedDate}_Consumption_${accountId}.html`;

            downloadHTML(combinedData, filename, accountId);
            createToaster('Consumption Report exported successfully!', 'success');
        } else {
            createToaster('No data available for export.', 'error');
        }
    } catch (error) {
        createToaster(`${error.message}`, 'error');
    }
}

// Function to convert JSON data to an HTML file and trigger download
function downloadHTML(data, filename, accountId) {
    function formatNumber(num) {
        return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function estimateCCU(computeData, coreData, enrData, syntheticsData) {
        // Sort data by "Month of timestamp" in descending order
        const sortedComputeData = computeData.sort((a, b) => new Date(b["Month of timestamp"]) - new Date(a["Month of timestamp"]));

        // Calculate the average of "Legacy CCUs" for the last 5 months excluding the most recent one
        let legacyCCUAverage = 0;
        let legacyCCUBuffer = 0;
        const monthsToConsider = Math.min(sortedComputeData.length - 1, 5); // Number of months to consider, up to 5, excluding the most recent one

        if (monthsToConsider > 0) {
            const legacyCCUsLastMonths = sortedComputeData.slice(1, 1 + monthsToConsider).map(month => month["Legacy CCUs"]);
            legacyCCUAverage = legacyCCUsLastMonths.reduce((sum, ccus) => sum + ccus, 0) / legacyCCUsLastMonths.length;
            legacyCCUBuffer = Math.max(...legacyCCUsLastMonths) - legacyCCUAverage;
        }

        const sortedCoreData = coreData.sort((a, b) => new Date(b["Month of timestamp"]) - new Date(a["Month of timestamp"]));
        let coreCCUAverage = 0;
        const coreMonthsToConsider = Math.min(sortedCoreData.length - 1, 3);
        if (coreMonthsToConsider > 0) {
            const coreCCUsLastMonths = sortedCoreData.slice(1, 1 + coreMonthsToConsider).map(month => month["CCUs Used"]);
            coreCCUAverage = coreCCUsLastMonths.reduce((sum, ccus) => sum + ccus, 0) / coreCCUsLastMonths.length;
        }

        const sortedEnrData = enrData.sort((a, b) => new Date(b["Month of timestamp"]) - new Date(a["Month of timestamp"]));
        let enrCCUAverage = 0;
        let enrCCUBuffer = 0;
        const enrMonthsToConsider = Math.min(sortedEnrData.length - 1, 5);
        if (enrMonthsToConsider > 0) {
            const enrCCUsLastMonths = sortedEnrData.slice(1, 1 + enrMonthsToConsider).map(month => month["CCUs Used"]);
            enrCCUAverage = enrCCUsLastMonths.reduce((sum, ccus) => sum + ccus, 0) / enrCCUsLastMonths.length;
            enrCCUBuffer = Math.max(...enrCCUsLastMonths) - enrCCUAverage;
        }

        const sortedSyntheticsData = syntheticsData.sort((a, b) => new Date(b["Month of timestamp"]) - new Date(a["Month of timestamp"]));
        let syntheticsCCUAverage = 0;
        let syntheticsCCUBuffer = 0;
        const syntheticsMonthsToConsider = Math.min(sortedSyntheticsData.length - 1, 3);
        if (syntheticsMonthsToConsider > 0) {
            const syntheticsCCUsLastMonths = sortedSyntheticsData.slice(1, 1 + syntheticsMonthsToConsider).map(month => month["CCUs Used"]);
            syntheticsCCUAverage = syntheticsCCUsLastMonths.reduce((sum, ccus) => sum + ccus, 0) / syntheticsCCUsLastMonths.length;
            syntheticsCCUBuffer = Math.max(...syntheticsCCUsLastMonths) - syntheticsCCUAverage;
        }

        const coreCCU = enrCCUBuffer+syntheticsCCUBuffer;
        const swing = legacyCCUBuffer+coreCCU;
        const maxCoreCCU = coreCCUAverage+swing

        return {
            legacyCCUAverage: formatNumber(legacyCCUAverage),
            legacyCCUBuffer: formatNumber(legacyCCUBuffer),
            coreCCUAverage: formatNumber(coreCCUAverage),
            coreCCU: formatNumber(coreCCU),
            swing: formatNumber(swing),
            maxCoreCCU: formatNumber(maxCoreCCU)
        };
    }

    function generateSummaryTable(ingestData, usersData, computeData, enrData, syntheticsData, coreData, advancedData) {
        // Prepare the combined data
        const combinedData = {};

        // Prepare ingest data
        ingestData.forEach(row => {
            if (!combinedData[row["Month of timestamp"]]) {
                combinedData[row["Month of timestamp"]] = { "Month of timestamp": row["Month of timestamp"], "Data (GB)": 0 };
            }
            combinedData[row["Month of timestamp"]]["Data (GB)"] += row["Data Ingested"];
        });

        // Prepare users data
        usersData.forEach(row => {
            if (!combinedData[row["Month of timestamp"]]) {
                combinedData[row["Month of timestamp"]] = { "Month of timestamp": row["Month of timestamp"], "Total Users": 0, "Full Users": 0, "Core Users": 0, "Basic Users": 0 };
            }
            combinedData[row["Month of timestamp"]]["Total Users"] = row["Total Users"];
            combinedData[row["Month of timestamp"]]["Full Users"] = row.FullPlatformUsers || 0;
            combinedData[row["Month of timestamp"]]["Core Users"] = row.CoreUsers || 0;
            combinedData[row["Month of timestamp"]]["Basic Users"] = row.BasicUsers || 0;
        });

        // Prepare compute data
        computeData.forEach(row => {
            if (!combinedData[row["Month of timestamp"]]) {
                combinedData[row["Month of timestamp"]] = { "Month of timestamp": row["Month of timestamp"], "Legacy CCUs": 0, "Alert CCUs": 0, "Dashboard CCUs": 0 };
            }
            combinedData[row["Month of timestamp"]]["Legacy CCUs"] = row["Legacy CCUs"];
            combinedData[row["Month of timestamp"]]["Alert CCUs"] = row["Alert CCUs"];
            combinedData[row["Month of timestamp"]]["Dashboard CCUs"] = row["Dashboard CCUs"];
        });

        // Prepare enr data
        enrData.forEach(row => {
            if (!combinedData[row["Month of timestamp"]]) {
                combinedData[row["Month of timestamp"]] = { "Month of timestamp": row["Month of timestamp"], "E&R CCUs": 0 };
            }
            combinedData[row["Month of timestamp"]]["E&R CCUs"] = row["CCUs Used"] || 0;
        });

        // Prepare synthetics data
        syntheticsData.forEach(row => {
            if (!combinedData[row["Month of timestamp"]]) {
                combinedData[row["Month of timestamp"]] = { "Month of timestamp": row["Month of timestamp"], "Synthetics CCUs": 0 };
            }
            combinedData[row["Month of timestamp"]]["Synthetics CCUs"] = row["CCUs Used"] || 0;
        });

        // Prepare core data
        coreData.forEach(row => {
            if (!combinedData[row["Month of timestamp"]]) {
                combinedData[row["Month of timestamp"]] = { "Month of timestamp": row["Month of timestamp"], "Core CCUs": 0 };
            }
            combinedData[row["Month of timestamp"]]["Core CCUs"] = row["CCUs Used"] || 0;
        });

        // Prepare advanced data
        advancedData.forEach(row => {
            if (!combinedData[row["Month of timestamp"]]) {
                combinedData[row["Month of timestamp"]] = { "Month of timestamp": row["Month of timestamp"], "Advanced CCUs": 0 };
            }
            combinedData[row["Month of timestamp"]]["Advanced CCUs"] = row["CCUs Used"] || 0;
        });

        const summaryTableData = Object.values(combinedData).sort((a, b) => new Date(a["Month of timestamp"]) - new Date(b["Month of timestamp"]));

        function generateSummaryTableHTML(tableData) {
            const headers = ["Month of timestamp", "Legacy CCUs", "Core CCUs", "Advanced CCUs", "Alert CCUs", "Dashboard CCUs", "E&R CCUs", "Synthetics CCUs", "Total Users", "Full Users", "Core Users", "Basic Users", "Data (GB)"];
            const headerNames = headers.map(header => `<b>${header}</b>`);
            const tableDataValues = headers.map(header => tableData.map(row => formatNumber(row[header] || 0)));

            return {
                headers: headerNames,
                data: tableDataValues
            };
        }

        const summaryTableHTMLData = generateSummaryTableHTML(summaryTableData);

        return `
            <h2>Summary</h2>
            <div id="summaryTable"></div>
            <div id="groupedBarChart"></div>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    const summaryTableData = [{
                        type: 'table',
                        header: {
                            values: ${JSON.stringify(summaryTableHTMLData.headers)},
                            align: "center",
                            line: { width: 1, color: 'black' },
                            fill: { color: "grey" },
                            font: { family: "Arial", size: 12, color: "white" }
                        },
                        cells: {
                            values: ${JSON.stringify(summaryTableHTMLData.data)},
                            align: "center",
                            line: { color: "black", width: 1 },
                            fill: { color: ['white', 'lightgrey'] },
                            font: { family: "Arial", size: 11, color: ["black"] }
                        }
                    }];

                    const xData = summaryTableData[0].cells.values[0]; // Extract the x-axis data (Months)
                    const legacyCCUs = summaryTableData[0].cells.values[1]; // Extract Legacy CCUs data
                    const coreCCUs = summaryTableData[0].cells.values[2]; // Extract Core CCUs data
                    const advancedCCUs = summaryTableData[0].cells.values[3]; // Extract Advanced CCUs data

                    const data = [
                        {
                            x: xData,
                            y: legacyCCUs,
                            name: 'Legacy CCUs',
                            type: 'bar'
                        },
                        {
                            x: xData,
                            y: coreCCUs,
                            name: 'Core CCUs',
                            type: 'bar'
                        },
                        {
                            x: xData,
                            y: advancedCCUs,
                            name: 'Advanced CCUs',
                            type: 'bar'
                        }
                    ];

                    const layout = {
                        barmode: 'group',
                        title: 'CCUs by Month',
                        xaxis: { title: 'Month of timestamp' },
                        yaxis: { title: 'CCUs' }
                    };

                    Plotly.newPlot('summaryTable', summaryTableData);
                    Plotly.newPlot('groupedBarChart', data, layout);
                });
            </script>
        `;
    }

    function generateIngestHTML(ingestData) {
        // Extract unique metrics and account names from the data, excluding specified columns
        const excludedColumns = ["PixieBytes"];
        let uniqueMetrics = [...new Set(ingestData.map(row => row.Metric).filter(metric => !excludedColumns.includes(metric) && Boolean(metric)))];

        // Add the new combined columns and remove the individual columns
        uniqueMetrics = uniqueMetrics.filter(metric => !["ApmEventsBytes", "TracingBytes", "InfraIntegrationBytes", "InfraProcessBytes", "InfraHostBytes", "MetricsBytes", "PixieBytes", "CustomEventsBytes", "WorkloadsBytes", "MarkerEventsBytes", "SecurityBytes", "ServiceLevelsManagementBytes", "ServerlessBytes"].includes(metric));
        uniqueMetrics.push("APM", "Infrastructure", "External/Others");

        // Rename "LoggingBytes" to "Logging"
        uniqueMetrics = uniqueMetrics.map(metric => metric === "LoggingBytes" ? "Logging" : metric);

        const uniqueAccountNames = [...new Set(ingestData.map(row => row["Consuming Account Name"]).filter(Boolean))];

        // Create a mapping of month to metric values
        const monthToMetricsMap = ingestData.reduce((acc, row) => {
            const { "Metric": metric, "Month of timestamp": month, "Data Ingested": dataIngested } = row;
            const accountName = row["Consuming Account Name"];
            if (month && metric && !excludedColumns.includes(metric)) {
                if (!acc[month]) acc[month] = { "Month of timestamp": month, "Data Ingested": 0, "APM": 0, "Infrastructure": 0, "External/Others": 0 };
                if (metric === "ApmEventsBytes" || metric === "TracingBytes" || metric === "SecurityBytes" || metric === "ServerlessBytes") {
                    acc[month].APM += dataIngested;
                } else if (metric === "InfraIntegrationBytes" || metric === "InfraProcessBytes" || metric === "InfraHostBytes" || metric === "PixieBytes") {
                    acc[month].Infrastructure += dataIngested;
                } else if (metric === "MetricsBytes" || metric === "CustomEventsBytes" || metric === "WorkloadsBytes" || metric === "MarkerEventsBytes" || metric === "ServiceLevelsManagementBytes") {
                    acc[month]["External/Others"] += dataIngested;
                } else {
                    acc[month][metric === "LoggingBytes" ? "Logging" : metric] = (acc[month][metric === "LoggingBytes" ? "Logging" : metric] || 0) + dataIngested;
                }
                acc[month][accountName] = (acc[month][accountName] || 0) + dataIngested;
                acc[month]["Data Ingested"] += dataIngested;
            }
            return acc;
        }, {});

        // Convert the mapping to an array
        const tableData = Object.values(monthToMetricsMap).sort((a, b) => new Date(a["Month of timestamp"]) - new Date(b["Month of timestamp"]));

        function generateTableData(tableValues) {
            const headers = ["Month of timestamp", "Data Ingested", ...uniqueMetrics];
            const headerNames = headers.map(header => `<b>${header}</b>`);
            const tableData = headers.map(header => tableValues.map(row => formatNumber(row[header] || 0)));
            const fillColors = headers.map(header => header === "Month of timestamp" || header === "Data Ingested" ? "lightgrey" : "white");

            return {
                headers: headerNames,
                data: tableData,
                fillColors: fillColors
            };
        }

        const initialTableData = generateTableData(tableData);

        // Prepare data for the stacked bar chart
        const xValues = [...new Set(ingestData.map(row => row["Month of timestamp"]))].sort((a, b) => new Date(a) - new Date(b));
        const barChartData = uniqueAccountNames.map(accountName => ({
            x: xValues,
            y: xValues.map(month => {
                const monthData = tableData.find(row => row["Month of timestamp"] === month);
                return monthData ? monthData[accountName] || 0 : 0;
            }),
            name: accountName,
            type: 'bar'
        }));

        return `
            <h2>Ingest</h2>
            <div id="ingestChart" style="height: 600px;"></div>
            <div id="ingestTable" style="height: auto;"></div>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    const ingestTableData = [{
                        type: 'table',
                        header: {
                            values: ${JSON.stringify(initialTableData.headers)},
                            align: "center",
                            line: { width: 1, color: 'black' },
                            fill: { color: "grey" },
                            font: { family: "Arial", size: 12, color: "white" }
                        },
                        cells: {
                            values: ${JSON.stringify(initialTableData.data)},
                            align: "center",
                            line: { color: "black", width: 1 },
                            fill: { color: ${JSON.stringify(initialTableData.fillColors)} },
                            font: { family: "Arial", size: 11, color: ["black"] }
                        }
                    }];

                    const layout = {
                        barmode: 'stack',
                        title: 'Data Ingest vs. Month',
                        xaxis: { title: 'Month' },
                        yaxis: { title: 'Data Ingested' },
                        height: 600 // Increased height
                    };

                    Plotly.newPlot('ingestChart', ${JSON.stringify(barChartData)}, layout);
                    Plotly.newPlot('ingestTable', ingestTableData);
                });
            </script>
        `;
    }

    function generateUsersHTML(usersData) {
        // Extract headers and ensure "Total Users" is the rightmost column
        const headers = Object.keys(usersData[0]);
        const totalUsersIndex = headers.indexOf("Total Users");
        if (totalUsersIndex > -1) {
            headers.push(headers.splice(totalUsersIndex, 1)[0]);
        }
        const headerNames = headers.map(header => `<b>${header}</b>`);

        // Prepare data for Plotly table
        const tableValues = headers.map(header => usersData.map(row => row[header] || 0));

        // Prepare data for stacked bar chart
        const xValues = usersData.map(row => row["Month of timestamp"]).reverse();
        const uniqueUserTypes = headers.filter(header => header !== "Month of timestamp" && header !== "Total Users");

        const barData = uniqueUserTypes.map(userType => ({
            x: xValues,
            y: xValues.map(month => {
                const monthData = usersData.find(row => row["Month of timestamp"] === month);
                return monthData ? monthData[userType] || 0 : 0;
            }),
            name: userType,
            type: 'bar'
        }));

        return `
            <h2>Users</h2>
            <div id="usersChart"></div>
            <div id="usersTable"></div>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    const usersTableData = [{
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
                    const layout = {
                        barmode: 'stack',
                        title: 'Users by Month',
                        xaxis: { title: 'Month' },
                        yaxis: { title: 'Users' }
                    };
                    Plotly.newPlot('usersChart', ${JSON.stringify(barData)}, layout);
                    Plotly.newPlot('usersTable', usersTableData);
                });
            </script>
        `;
    }

    function generateComputeHTML(computeData) {
        // Extract headers and ensure "CCU Total" is the rightmost column
        const headers = ["Month of timestamp", "Legacy CCUs", "Alert CCUs", "Dashboard CCUs", "APM", "Traces", "Browser", "Infrastructure", "Logs", "Mobile"];
        const headerNames = headers.map(header => `<b>${header}</b>`);

        // Prepare data for Plotly table
        const tableValues = headers.map(header => computeData.map(row => formatNumber(row[header] || 0)));

        // Get the latest month data for the pie chart
        const latestMonthData = computeData.sort((a, b) => new Date(b["Month of timestamp"]) - new Date(a["Month of timestamp"]))[0];

        // Prepare data for the pie chart
        const pieChartData = {
            values: [],
            labels: [],
            type: 'pie'
        };

        for (const [key, value] of Object.entries(latestMonthData)) {
            if (key !== "Month of timestamp" && key !== "Legacy CCUs" && key !== "Alert CCUs" && key !== "Dashboard CCUs") {
                if (key === "Alert Conditions" || key === "Alerts") {
                    const alertIndex = pieChartData.labels.indexOf("Alerts");
                    if (alertIndex === -1) {
                        pieChartData.labels.push("Alerts");
                        pieChartData.values.push(value);
                    } else {
                        pieChartData.values[alertIndex] += value;
                    }
                } else {
                    pieChartData.labels.push(key);
                    pieChartData.values.push(value);
                }
            }
        }

        const pieChartTitle = `CCU Usage by Capability ${latestMonthData["Month of timestamp"]}`;

        return `
            <h2>Compute</h2>
            <div id="computePieChart"></div>
            <div id="computeTable"></div>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    const computeTableData = [{
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

                    const pieChartData = {
                        values: ${JSON.stringify(pieChartData.values)},
                        labels: ${JSON.stringify(pieChartData.labels)},
                        type: 'pie'
                    };

                    const layout = {
                        title: ${JSON.stringify(pieChartTitle)}
                    };

                    Plotly.newPlot('computePieChart', [pieChartData], layout);
                    Plotly.newPlot('computeTable', computeTableData);
                });
            </script>
        `;
    }

    const { legacyCCUAverage, legacyCCUBuffer, coreCCUAverage, coreCCU, swing, maxCoreCCU } = estimateCCU(data.compute, data.core, data.enr, data.synthetics);

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consumption Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        table {
            width: 25%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 12px;
            text-align: left;
        }
        td.right-align {
            text-align: right;
        }
    </style>
    <script src="https://cdn.plot.ly/plotly-2.35.2.min.js" charset="utf-8"></script>
</head>
<body>
    <h1>Consumption Report for Account # ${accountId}</h1>
    <table>
        <tr>
            <td><b>Legacy CCU Average</b></td>
            <td class="right-align">${legacyCCUAverage}</td>
        </tr>
        <tr>
            <td><b>Legacy CCU Buffer</b></td>
            <td class="right-align">${legacyCCUBuffer}</td>
        </tr>
        <tr>
            <td><b>Core CCU Average</b></td>
            <td class="right-align">${coreCCUAverage}</td>
        </tr>
        <tr>
            <td><b>CoreCCU (E&R+Synthetics)</b></td>
            <td class="right-align">${coreCCU}</td>
        </tr>
        <tr>
            <td><b>Total Swing</b></td>
            <td class="right-align">${swing}</td>
        </tr>
        <tr>
            <td><b>Core CCU Min (Avg)</b></td>
            <td class="right-align">${coreCCUAverage}</td>
        </tr>
        <tr>
            <td><b>CoreCCU Max</b></td>
            <td class="right-align">${maxCoreCCU}</td>
        </tr>
    </table>
    ${generateSummaryTable(data.ingest, data.users, data.compute, data.enr, data.synthetics, data.core, data.advanced)}
    ${data.ingest ? generateIngestHTML(data.ingest) : ''}
    ${data.users ? generateUsersHTML(data.users) : ''}
    ${data.compute ? generateComputeHTML(data.compute) : ''}
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
    "Consumption Report": exportGraphQLToHTML,
};

// Function to create and add a dropdown menu and button to the webpage
function addExportControls() {
    // Function to extract account ID from URL
    function getAccountIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('account');
    }

    // Get account ID from URL and set it as the value of accountIdInput
    const accountId = getAccountIdFromURL();

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
    accountIdInput.value = accountId ? accountId : ''; // Auto-fill with account ID from URL if available
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
        } else if (e.target.value === "Consumption Report") {
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
                } else if (selectedFunctionName === "Consumption Report") {
                    const accountId = parseInt(getAccountIdFromURL()); // Ensure accountId is a number
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
addToasterStyles();

})();
