# CxEngage REST API

## Authentication

How to authenticate with CxEngage API - [http://docs.cxengage.com/docs/authentication](http://docs.cxengage.com/docs/authentication/)

## Sending in Events

To send in custom events - [http://docs.cxengage.com/docs/custom-events/](http://docs.cxengage.com/docs/custom-events/)

## CxEngage API 1.0
url - https://api.cxengage.net/
version - 1.0

## Error Codes

CxEngage REST API uses standard HTTP response codes for errors.

Code | Description
-- | --
**400** | Required fields are missing
**401** | Incorrect credentials
**403** | User does not have access to the provided tenant
**404** | The provided tenant or item does not exist

## Tenants

### Retrieving a Tenant

Retrieve the details of a tenant which your authenticated user has access to.

> Definition

```http
GET https://api.cxengage.net/1.0/tenants/{{tid}}
```

#### Arguments

Name | Description
--- | ---
**tid** | Tenant ID

> Example Request

```bash
curl -X GET https://api.cxengage.net/1.0/tenants/tenant1 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns a tenant object if a valid tenant is provided, returns [an error]() otherwise.

> Example Response

```json
{
    "id": "tenant1",
    "name": "Tenant One"
}
```

## Key Attribute

### Retrieving the Key Attribute

Retrieve the key attribute of the specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```http
GET https://api.cxengage.net/1.0/tenants/{{tid}}/key-attribute
```

#### Arguments

Name | Description
--- | ---
**tid** | Tenant ID

> Example Request
```bash
curl -X GET https://api.cxengage.net/1.0/tenants/tenant1/key-attribute \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns a JSON object containing the key attribute of provided tenant if valid
tenant is provided. Returns [an error]() otherwise.

> Example Response

```json
{
    "key": "id"
}
```

### Update the Key Attribute

Updates the key attribute of the specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```http
POST https://api.cxengage.net/1.0/tenants/{{tid}}/key-attribute
```

#### Arguments

Name | Description
--- | ---
**key** | Key Attribute

> Example Object

```json
{
  "key": "username"
}
```

> Example Request

```bash
curl -X POST https://api.cxengage.net/1.0/tenants/tenant1/key-attribute \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"key" : "username"}'
```

#### Returns

Returns a JSON object containing the key attribute if update succeeded. Returns
[an error]() if update parameters are invalid.

> Example Response

```json
{
    "key": "username"
}
```

## Patterns

A pattern describes a series of events that make up a customer's journey as they interact with your company across channels. As a user of CxEngage, you write patterns that match journeys which are important to your organization.

For more information about [patterns]() and [using the CxEngage DSL](), please visit the [general documentation]().

### Pattern Object

#### Attributes

Name | Type | Description
--- | --- | ---
**id** | **string** | Unique identifier
**name** | **string** | Human-friendly of the pattern
**description** | **string** | A people friendly description of what this pattern should do
**status** | **boolean** | Whether or not this pattern is being matched against
**when** | **string** | CxEngage DSL of what pattern to look for
**then** | **string** | CxEngage DSL of how to react when matched

> Example Object

```json
{
  "name": "Sample Pattern",
  "description": "Sample",
  "status":true,
  "when": "(when (event (= id \"1234\")))",
  "then": "(seq (send echo message {:message \"Hello world\"}))"
}
```

### Create a Pattern

Creates a pattern object for specified tenant.

> Definition

```http
POST https://api.cxengage.net/1.0/tenants/{{tid}}/patterns
```

#### Arguments

Name | Description
--- | ---
**name** | Human-friendly name of the pattern
description | Description of the pattern
status |  Boolean for enabled/disabled state
when | CxEngage DSL of what pattern to look for
then | CxEngage DSL of how to react when matched

> Example Request

```bash
curl -X POST https://api.cxengage.net/1.0/tenants/tenant1/patterns \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"then":"(send echo message {:message \"Hello curl\"})",
          "when":"(event (= type \"curl\"))","status":true,"name":"curl Pattern"}'
```

#### Returns

Returns a pattern object if successful, returns [an error]() otherwise.

If `status` is set to true, the `when` and `then` fields must be provided and must be valid
CxEngage DSL. If not, [an error]() will occur.

> Example Response

```json
{
  "id": "PT2",
  "name": "Sample Pattern",
  "description": "Sample",
  "status":true,
  "when": "(when (event (= \"id\" \"1234\")))",
  "then": "(seq (send echo message {:message \"Hello world\"}))"
}
```

## Retrieve All Patterns

Request

```http
GET /1.0/tenants/{{tenant-name}}/patterns HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

Response

```json

  {
   "id": "PT1",
   "then": "(par (send echo message {:message \"We should probably call the customer\"})
                 (send echo message {:message \"We should probably call the customer now \"}))",
   "when": "(within 1 minutes (allOf (count 4 (event (and (= customerSegment \"Gold\")
                                                          (= eventType \"flcheck\"))))
                                              (event (and (= customerSegment \"Gold\")
                                                          (= eventType \"cnclTicket\"))))))",
   "description": "Loyalty Pattern for Gold customers",
   "name": "Loyalty Pattern"
  }

```


**Retrieves chosen pattern for the given tenant**

Request

```http
GET /1.0/tenants/{{tenant-name}}/patterns HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json
Authorization: Bearer {{token}}
```

Response

```json
{
  "id":"PT2",
  "when":"(when (event (= \"id\" \"1234\")))",
  "then":"(seq (send echo message {:message \"Hello world\"}))",
  "status":true,
  "description":"Sample Pattern",
  "name":"Sample Pattern"
}
```
curl Example

```bash
curl -XGET https://api.cxengage.net/tenants/{{tenant-name}}/patterns \
     -H 'Authorization: Bearer {{token}}'
```

**Update chosen pattern**

Request

```http
PUT /1.0/tenants/{{tenant-name}}/patterns/PT5 HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
Cache-Control: no-cache

```

```json
{
"then" : "(send sendgrid email {:to *email*, :subject \"Welcome to a wonderful put experience\"})"
}
```

Response

```json

{"id":"PT5",
"then":"(send sendgrid email {:to *email*, :subject \"Welcome to a wonderful put experience\"})",
"when":"(event (or (= username \"cxengage\")))",
"status":true,
"name":"Updated Pattern"
}
```

curl Example
```bash
curl -X PUT https://api.cxengage.net/1.0/tenants/{{tenant-name}}/patterns/PT5 \
 -H 'Authorization: Bearer {{token}}' \
 -H 'Content-Type: application/json; charset=utf-8' \
 -d '{"then" : "(send sendgrid email {:to *email*, :subject \"Welcome to a wonderful put experience\"})"}'

```

## Templates

**Retrieves templates for the given tenant**

**Mandatory Parameters**

name

```
Name of Template
```

**Optional Parameters**

template

```
Template to create
```

description

```
Description of template
```

Request

```http
GET /1.0/tenants/{{tenant-name}}/templates/TM1 HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

Response

```json

    {
        "id": "TM1",
        "template": "Hi {{FirstName}}, sorry we missed your call. Call Joe at
+14153159430 re: 401K needs.",
        "description": "Default SMS message with click-to-call",
        "name": "SMS"
    }
```

curl Example

```bash
curl -XGET https://api.cxengage.net/tenants/{{tenant-name}}/templates/TM1 \
     -H 'Authorization: Bearer {{token}}'
```

**Update chosen template**

Request

```http
POST /1.0/tenants/{{tenant-name}}/templates HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

```json
{
    "template": "Hi {{first-name}} We apologize for the inconvenience. Please contact us at {{email-address}}",
    "description": "SMS apologizing to customer",
    "name": "SMS"
}
```

Response

```json
{
    "id": "TM1",
    "template": "Hi {{first-name}} We apologize for the inconvenience. Please contact us at {{email-address}}",
    "description": "SMS apologizing to customer",
    "name": "SMS"
}
```

curl Example

```bash

curl -X POST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/templates \
 -H 'Authorization: Bearer {{token}}' \
 -H 'Content-Type: application/json; charset=utf-8' \
 -d '{"template": "Welcome to CxEngage 4.0", "description" : "sample description", "name" : "Welcome"}'

```

**Retrieve chosen template**

Request

```http
GET /1.0/tenants/{{tenant-name}}/templates/TM1 HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

Response

```json

{
    "id": "TM1",
    "template": "Hi {{FirstName}}, sorry we missed your call. Call Joe at
+14153159430 re: 401K needs.",
    "description": "Default SMS message with click-to-call",
    "name": "SMS"
}
```

curl Example

```bash
curl -XGET https://api.cxengage.net/1.0/tenants/{{tenant-name}}/templates/TM1 \
     -H 'Authorization: Bearer {{token}}'
```

**Update chosen template**

Request

```http
PUT /1.0/tenants/{{tenant-name}}/templates/TM1 HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

```json
{

    "name": "Test Template"
}
```

Response

```json
{
    "id": "TM1",
    "template": "Hi {{first-name}}. We apologize for the inconvenience. Please contact us at {{email-address}}",
    "description": "SMS apologizing to customer",
    "name": "Test Template"
}
```

curl Example

```bash
curl -XPUT https://api.cxengage.net/1.0/tenants/{{tenant-name}}/templates/TM1 \
     -H 'Authorization: Bearer {{token}}' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"name":"Test Template"}'
```

**Delete chosen template**

Request

```http
DELETE /1.0/tenants/{{tenant-name}}/templates/TM1 HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

Response

```json
{

  "TM1"
}
```

curl Example

```bash
curl -IX DELETE https://api.cxengage.net/1.0/tenants/{{tenant-name}}/templates/TM1 \
 -H 'Authorization: Bearer {{token}}' \
```

## Listeners

**Retrieve listeners**

Request

```http
GET /1.0/tenants/{{tenant-name}}/listeners HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

Response

```json

[
    {
        "status": true,
        "topic": "CxDemo_0720v2",
        "name": "My Salesforce Listener",
        "version": "26.0",
        "type": "salesforce",
        "mapping": {
            "user": "user__c",
            "type": "Type",
            "stage": "StageName",
            "amount": "Amount",
            "daystoclose": "daysToClose__c",
            "product": "Product__c"
        },
        "id": "LI2"

    },
    {
        "id": "LI1",
        "name": "Demo Datasift",
        "type": "datasift",
        "mapping": {
            "username": "interaction.author.username",
            "sentiment": "salience.content.sentiment",
            "id": "twitter.user.screen_name"
        },
        "hash": "xxxxxxxxxxxxxx",
        "status": true
    }
]
```

curl Example
```bash
curl -XGET https://api.cxengage.net/1.0/tenants/{{tenant-name}}/listeners \
     -H 'Authorization: Bearer {{token}}'
```

**Create listener**

Request

```http
POST /1.0/tenants/{{tenant-name}}/listeners HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
```

Salesforce Listener Example

Request

```
  POST /1.0/tenants/tenant-name/listeners
```

```json

{
    "status": true,
    "topic": "CxDemo_0720v2",
    "name": "My Salesforce Listener",
    "version": "26.0",
    "type": "salesforce",
    "mapping": {
        "user": "user__c",
        "type": "Type",
        "stage": "StageName",
        "amount": "Amount",
        "daystoclose": "daysToClose__c",
        "product": "Product__c"
    }
}
```
Response

```json
{
    "id": "LI3",
    "status": true,
    "topic": "CxDemo_0720v2",
    "name": "My Salesforce Listener",
    "version": "26.0",
    "type": "salesforce",
    "mapping": {
        "user": "user__c",
        "type": "Type",
        "stage": "StageName",
        "amount": "Amount",
        "daystoclose": "daysToClose__c",
        "product": "Product__c"
    }
}
```

curl Example

```bash
curl -XPOST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/listeners \
     -H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json; charset=utf-8' \
-d '{"name":"My Salesforce Listener","type":"salesforce","mapping":{"user":"user__c","type":"Type",
    "stage":"StageName","amount":"Amount","daystoclose":"daysToClose__c","product": "Product__c"},"status":true}'
```

**Datasift Listener Example**

Request

```http
POST /1.0/tenants/{{tenant-name}}/listeners HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
```

```json

{
    "name": "sentiment listener",
    "type": "datasift",
    "mapping": {
        "username": "interaction.author.username",
        "retweet_count": "twitter.retweet.count",
        "network": "interaction.type",
        "sentiment": "salience.content.sentiment",
        "followers": "twitter.user.followers_count",
        "user_url": "interaction.author.link",
        "profile_image": "twitter.user.profile_image_url"
    },
    "hash": "datasifthash",
    "status": true
}
```
Response

```json
{
    "id": "LI1",
    "name": "sentiment listener",
    "type": "datasift",
    "mapping": {
        "username": "interaction.author.username",
        "retweet_count": "twitter.retweet.count",
        "network": "interaction.type",
        "sentiment": "salience.content.sentiment",
        "followers": "twitter.user.followers_count",
        "user_url": "interaction.author.link",
        "profile_image": "twitter.user.profile_image_url"
    },
    "hash": "datasifthash",
    "status": true
}
```

curl Example

```bash
curl -XPOST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/listeners \
     -H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json; charset=utf-8' \
-d '{"name":"Demo Datasift","type":"datasift",
    "mapping":{"username":"interaction.author.username","sentiment":"salience.content.sentiment",
    "id":"twitter.user.screen_name"},"hash":{{{datasift-hash}},"status":true}'
```

**Retrieve chosen listener**

Request

```http
GET /1.0/tenants/{{tenant-name}}/listeners/LI4 HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

Response

```json

{
        "status": true,
        "topic": "CxDemo_0720v2",
        "name": "My Salesforce Listener",
        "version": "26.0",
        "type": "salesforce",
        "mapping": {
            "user": "user__c",
            "type": "Type",
            "stage": "StageName",
            "amount": "Amount",
            "daystoclose": "daysToClose__c",
            "product": "Product__c"
        },
        "id": "LI4"

}
```

curl Example

```bash
curl -XGET https://api.cxengage.net/1.0/tenants/{{tenant-name}}/listeners/LI4 \
     -H 'Authorization: Bearer {{token}}'
```

**Update chosen listener**

Request

```http
PUT /1.0/tenants/{{tenant-name}}/listeners/LI4 HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

```json

  {"name" : "Updated Name for listener"}

```

Response

```json

{
    "id": "LI4",
    "status": false,
    "topic": "CxDemo_0720v2",
    "name": "Updated Name for listener",
    "version": "26.0",
    "type": "salesforce",
    "mapping": {
        "user": "user__c",
        "type": "Type",
        "stage": "StageName",
        "amount": "Amount",
        "daystoclose": "daysToClose__c",
        "product": "Product__c"
    }
}

```

curl Example

```bash
curl -XPUT https://api.cxengage.net/1.0/tenants/{{tenant-name}}/listeners/LI4 \
     -H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json; charset=utf-8' \
-d '{"name":"Updated Name for listener"}'
```

**Retrieve listener status**

Request
```http
GET /1.0/tenants/{{tenant-name}}/listeners/LI1/status HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json
Authorization: Bearer {{token}}
```

```json
{
    "id": "status",
    "status": "started",
    "message": "Connected to stream: hash"
}
```

curl Example

```bash
curl -XGET https://api.cxengage.net/1.0/tenants/{{tenant-name}}/listeners/LI1/status \
     -H 'Authorization: Bearer {{token}}'
```

**Delete chosen listener**

Request

```http
DELETE /1.0/tenants/{{tenant-name}}/listeners/LI54 HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
Cache-Control: no-cache

```

curl Example

```bash
curl -I -XDELETE https://api.cxengage.net/1.0/tenants/{{tenant-name}}/listeners/LI54 \
     -H 'Authorization: Bearer {{token}}'
```

## Integrations

**Retrieve integrations from tenant**

Request

```http
GET /1.0/tenants/{{tenant-name}}/integrations HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

Response

```json
[
  {
    "id": "datasift",
    "api-key": "keyvalue",
    "username": "usernamevalue"
}

    {
        "id": "echo"
    }
]
```

curl Example

```bash
curl -XGET https://api.cxengage.net/1.0/tenants/{{tenant-name}}/integrations \
     -H 'Authorization: Bearer {{token}}'
```

**Create specific integrations**

__Salesforce Example__

Salesforce Parameters

secret-token
```
Salesforce secret token
```
username
```
Salesforce username
```
password
```
Salesforce password
```
consumer-key
```
Salesforce Consumer key/secret
```
consumer-secret
```
Salesforce Consumer key/secret
```

Request

```http
POST /1.0/tenants/{{tenant-name}}/integrations/salesforce HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
```

```json
{
    "id": "salesforce",
    "type": "salesforce",
    "consumer-key": "consumerkey",
    "consumer-secret": "consumersecret",
    "username": "dev@userevents.com",
    "secret-token": "secret-token",
    "password": "password"
}
```

Response

```json

{
    "id": "salesforce",
    "type": "salesforce",
    "consumer-key": "consumerkey",
    "consumer-secret": "consumersecret",
    "username": "email@userevents.com",
    "secret-token": "secret-token",
    "password": "password",

}
```

curl Example

```bash
curl -XPOST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/integrations/salesforce \
     -H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json; charset=utf-8' \
-d '{"id": "salesforce", "type": "salesforce", "consumer-key": "consumerkey",
     "consumer-secret":"consumersecret","username":"email@userevents.com"
     "secret-token":"secret-token","password":"password"}'

```

__Twilio Example__

Request

```http
POST /1.0/tenants/{{tenant-name}}/integrations/twilio HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
```

Twilio Parameters

account
```
Twilio SID
```
password
```
Twilio Token
```

```json
{
    "id": "twilio",
    "account": "SID",
    "password": "Token"
}

```

Response

```json

{
    "id": "twilio",
    "account": "SID",
    "password": "Token"
}

```

curl Example

```bash
curl -XPOST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/integrations/twilio \
     -H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json; charset=utf-8' \
-d '{"id": "twilio", "type": "twilio", "account": "SID", "password":"Token"}'
```

__Sendgrid Example__

Sendgrid Parameters

account
```
SendGrid account
```
password
```
Sendgrid password
```

Request

```http
POST /1.0/tenants/{{tenant-name}}/integrations/sendgrid HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
```

```json
{
    "id": "sendgrid",
    "account": "username",
    "password": "password"
}

```

Response

```json

{
    "id": "sendgrid",
    "account": "username",
    "password": "password"
}

```

curl Example

```bash
curl -XPOST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/integrations/sendgrid \
     -H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json; charset=utf-8' \
-d '{"id": "sendgrid", "type": "sendgrid", "account": "username", "password":"password"}'

```

__Urban Airship Example__

Urban Airship Parameters

App Key
```
Urban Airship App Key
```
App Master Key
```
Urban Airship App Master Key
```

Request

```http
POST /1.0/tenants/{{tenant-name}}/integrations/urban-airship HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
```

```json
{
    "id": "urban-airship",
    "username": "app key",
    "password": "app master key"
}

```

Response

```json

{
    "id": "urban-airship",
    "username": "app key",
    "password": "app master key"
}

```

curl Example

```bash
curl -XPOST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/integrations/urban-airship \
     -H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json; charset=utf-8' \
-d '{"id": "urban-airship", "type": "urban-airship", "username": "app key", "password":"app master key"}'

```

__Datasift Example__

Datasift Parameters

username
```
DataSift username
```
api-key

```
DataSift api key
```

Request

```http
POST /1.0/tenants/{{tenant-name}}/datasift HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
```

```json
{
    "id": "datasift",
    "api-key": "api-key",
    "username": "username"
}

```

Response

```json

{
    "id": "datasift",
    "api-key": "api-key",
    "username": "username"
}

```

curl Example

```bash
curl -XPOST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/integrations/datasift \
     -H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json; charset=utf-8' \
-d '{"id": "datasift", "type": "datasift", "api-key": "api-key", "username":"username"}'

```

__Pusher Example__

Pusher Parameters
key
```
Pusher key
```
secret
```
Pusher secret
```

Request

```http
POST /1.0/tenants/{{tenant-name}}/pusher HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
```

```json
{
    "id": "pusher",
    "key": "key",
    "secret": "secret"
}

```

Response

```json

{
    "id": "pusher",
    "key": "key",
    "secret": "secret"
}

```

curl Example

```bash
curl -XPOST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/integrations/pusher \
     -H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json; charset=utf-8' \
-d '{"id": "pusher", "type": "pusher", "key": "key", "secret":"password"}'

```

**Retrieves specific integration from the given tenant**

Request

```http
GET /1.0/tenants/{{tenant-name}}/integrations/{{integration}} HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

Response

```json
{
    "id": "salesforce",
    "type": "salesforce",
    "consumer-key": "consumerkey",
    "consumer-secret": "consumersecret",
    "username": "dev@userevents.com",
    "secret-token": "secret-token",
    "password": "password"
}
```

curl Example

```bash
curl -XGET https://api.cxengage.net/1.0/tenants/{{tenant-name}}/integrations/twilio \
     -H 'Authorization: Bearer {{token}}'
```

__Generic Streaming Endpoint__

Request a stream ticket

```
POST /1.0/tenants/<tenantid>/ticket HTTP/1.1
Host: stream.cxengage.net
Authorization: Bearer <token>
```

Open websocket connection with ticket

```
wss://stream.cxengage.net/1.0/stream/<ticket>
```

## Augments

**Retrieves augments for the given tenant**

Request

```http
GET /1.0/tenants/{{tenant-name}}/augments HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json
Authorization: Bearer {{token}}
```

```json
[
    {
        "id": "AU1",
        "name": "Augment csv",
        "type": "file",
        "service": "engine"
    },
    {
        "description": "Sample description",
        "id": "AU5",
        "name": "Augment csv",
        "type": "file",
        "service": "engine"
    }
]
```

curl Example

```bash
curl -X GET https://api.cxengage.net/1.0/tenants/{{tenant-name}}/augments \
     -H 'Authorization: Bearer {{token}}'
```

**Create an Augment for a tenant**

**Mandatory Parameters**

name
```
Name of Augment
```

type
```
file or api based augment
```
service
```
engine or notification
```

**Optional Parameters**

options
```
Map of optional attributes shown below
```
url
```
url of the augment api
```
attributes
```
Attributes that would get augmented
```

Request

```
POST /1.0/tenants/{{tenant-name}}/augments HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

```json
{
    "service": "engine",
    "name": "rest augment api",
    "description": "description",
    "augment-service": "engine",
    "type": "api",
    "options": {
        "url": "hostname",
        "attributes": [
            "customerSegment"
        ]
    }
}
```

Response

```json
{
    "service": "engine",
    "id": "AU2",
    "name": "rest augment api",
    "description": "description",
    "augment-service": "engine",
    "type": "api",
    "options": {
        "url": "hostname",
        "attributes": [
            "customerSegment"
        ]
    }
}
```

curl Example

```bash
curl -X POST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/augment \
 -H 'Authorization: Bearer {{token}}' \
 -H 'Content-Type: application/json; charset=utf-8' \
 -d '{"service": "engine", "id": "AU2", "name": "rest augment api",
      "description": "describe", "augment-service": "engine", "type": "api",
      "options": { "url": "hostname", "attributes": ["customerSegment"]}}'
```

**File based augment**

Request

```
POST /1.0/tenants/{{tenant-name}}/augments HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

```json
{
    "service": "engine",
    "name": "rest augment api",
    "description": "description",
    "augment-service": "engine",
    "type": "file",
    "options": {
        "attributes": [
            "customerSegment", "twitter"
        ]
    }
}
```

Response

```json
{
    "service": "engine",
    "id": "AU2",
    "name": "rest augment api",
    "description": "description",
    "augment-service": "engine",
    "type": "file",
    "options": {
        "url": "hostname",
        "attributes": [
            "customerSegment"
        ]
    }
}
```

curl Example

```bash
curl -X POST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/augment \
 -H 'Authorization: Bearer {{token}}' \
 -H 'Content-Type: application/json; charset=utf-8' \
 -d '{"service": "engine","id": "AU2","name": "rest augment api",
      "description": "","augment-service": "engine","type":
      "file","options": {"attributes": ["customerSegment", "twitter"]}}'
```

**Upload CSV for Augment**

**Upload File**

Request

```
POST /1.0/tenants/{{tenant-name}}/augments/AU1/file HTTP/1.1
Host: api.cxengage.net
Authorization: Bearer {{token}}
Cache-Control: no-cache

----WebKitFormBoundaryE19zNvXGzXaLvS5C
Content-Disposition: form-data; name="file"; filename="1.csv"
Content-Type: text/csv

----WebKitFormBoundaryE19zNvXGzXaLvS5C
```

curl Example

```bash
curl -iX POST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/augments/AU14/file \
-H 'Authorization: Bearer Mc6NLc7ukAE3AR59XDqRbOxvVW1RTaoYHeLQm9P2WhlX' \
-F file=@1.csv
```

**Retrieves augment for the given tenant**

Request

```http
GET /1.0/tenants/{{tenant-name}}/augments/{{augment-id}} HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

Response

```json
{
    "id": "AU1",
    "name": "API based",
    "service": "engine",
    "type": "api",
    "options": {
        "url": "http://cxengage-augment",
        "attributes": [
            "phoneNumber",
            "customerSegment"
        ]
    }
}
```

curl Example

```bash
curl -X GET https://api.cxengage.net/1.0/tenants/{{tenant-name}}/augments/AU1 \
     -H 'Authorization: Bearer {{token}}'

```

**Retrieve augment CSV**

Request

```http
GET /1.0/tenants/{{tenant-name}}/augments/AU1/file HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json
Authorization: Bearer {{token}}
```

Response

```
custId,first-name
101,Ryan
201,John
123,Bob
```

curl Example

```bash
curl -X GET https://api.cxengage.net/1.0/tenants/{{tenant-name}}/augments/AU1/file \
     -H 'Authorization: Bearer {{token}}'
```
