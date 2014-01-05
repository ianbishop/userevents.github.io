# API

The Platform API allows you to administrate your CxEngage platform.

If you're looking to manage your services, create new tenants or users then this
API is built for you.

## Authentication

CxEngage Platform API has no authentication. It should be placed in a network
configuration that allows only privileged local network users to access it.

The Platform API does not need to be running for CxEngage to run. It is
suggested to shutdown the API when it is not in use.

## Errors

CxEngage Platform API uses standard HTTP response codes for errors.

Code | Description
-- | --
**200 OK** | Everything worked as expected
**201 Created** | Your item was successfully created
**204 No Content** | Your item was successfully deleted
**400 Bad Request** | Missing a required parameters
**404 Not Found** | The requested tenant or item does not exist
**500 Server Error** | Something bad happened on our end, please contact support

All responses are accommodated with a human-readable `error` field in a JSON
object to ease debugging.

## Versioning

We version our API to protect you from backward-incompatible changes.

Version | Endpoint
-- | --
**1.0** |

# Platform Management

## Instances

An instance describes a single physical collection of CxEngage services. An
instance can serve multiple tenants, virtual partitions on top of the services.
As an administrator, you can create many instances as required and assign
tenants to a single instance.

#### Attributes

Name | Type | Description
-- | -- | --
**id** | **string** | Unique identifier
**name** | **string** | Human-friendly name of the instance
**auth** | **string** | URL of the Authentication Service
**api** | **string** | URL of the CxEngage REST API
**events** | **string** | URL of the REST Receiver
**zk** | **string** | URL of Zookeeper Cluster *(comma separated)*
**redis** | **string** | URL of Redis
**stats** | **object** | JSON Object with stats configuration

> Example Object

```json
{
  "id": "IN1",
  "name": "My Instance",
  "auth": "http://localhost:8082",
  "api": "http://localhost:8081",
  "events": "http://localhost:8083",
  "zk": "localhost:2181",
  "redis": "redis://localhost:6379",
  "stats": {
    "type": "graphite",
    "url": "localhost",
    "port": 2003,
    "prefix": "development"
  }
}
```

[More on Instances >](http://docs.cxengage.com/docs/platform/instances/)

### Create an Instance

Creates an instance object.

> Definition

```
POST /1.0/instances
```
#### Arguments

Name | Description
-- | --
**name** | Human-friendly name of the instance
**zk** | URL of Zookeeper Cluster *(comma separated)*
**redis** | URL of Redis
auth | URL of the Authentication Service
api | URL of the CxEngage REST API
events | URL of the REST Receiver
stats | JSON Object with stats configuration

> Example Request

```
curl -X POST /1.0/instances \
     -H 'Content-Type: application/json' \
     -d '{"name": "My Instance", "zk": "localhost:2181",
          "redis": "redis://localhost:6379"}'
```

#### Returns

Returns an instance object if successful, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "IN2",
  "name": "My Instance",
  "zk": "localhost:2181",
  "redis": "redis://localhost:6379"
}
```

### Retrieve an Instance

Retrieves the details of an existing instance.

> Definition

```
GET /1.0/instances/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Instance ID

> Example Request

```
curl -XGET /1.0/instances/IN2
```

#### Returns

Returns an instance object if specified instance exists. Returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "IN2",
  "name": "My Instance",
  "zk": "localhost:2181",
  "redis": "redis://localhost:6379"
}
```

### Update an Instance

Updates an existing instance by setting the values of the provided parameters passed. Any parameters not provided will be unchanged.

> Definition

```
PUT /1.0/instances/IN2
```

#### Arguments

Name | Description
-- | --
name | Human-friendly name of the instance
zk | URL of Zookeeper Cluster *(comma separated)*
redis | URL of Redis
auth | URL of the Authentication Service
api | URL of the CxEngage REST API
events | URL of the REST Receiver
stats | JSON Object with stats configuration

> Example Request

```
curl -X PUT /1.0/instances/IN2 \
     -H 'Content-Type: application/json' \
     -d '{"name": "Production Instance"}'
```

#### Returns

Returns the instance object if the update succeeded, returns [an error](#errors)
otherwise.

> Example Response

```json
{
  "id": "IN2",
  "name": "Production Instance",
  "zk": "localhost:2181",
  "redis": "redis://localhost:6379"
}
```

### Delete an Instance

Permanently deletes an instance. It cannot be undone. Immediately stops all services. Your current authenticated user must have access to the specified tenant.

> Definition

```
DELETE /1.0/instances/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Instance ID

> Example Request

```
curl -IX DELETE /1.0/instances/IN2
```

#### Returns

Returns an **HTTP 204** if successful. Otherwise, returns [an error](#errors).

### List All Instances

Returns a list of all instances.

> Definition

```
GET /1.0/instances
```

#### Arguments

None.

> Example Request

```
curl -XGET /1.0/instances
```

#### Returns

Returns an array containing all instances.

> Example Response

```json
[
  {
    "id": "IN1",
    "name": "Root Instance",
    "zk": "localhost:2180",
    "redis": "redis://localhost:6378"
  },
  {
    "id": "IN2",
    "name": "Production Instance",
    "zk": "localhost:2181",
    "redis": "redis://localhost:6379"
  }
]
```

### List Tenants of an Instance

Returns a list of all tenants for a specified instance.

> Definition

```
GET /1.0/instances/{{id}}/tenants
```

#### Arguments

Name | Description
--- | ---
**id** | Instance ID

> Example Request

```
curl -XGET /1.0/instances/IN2/tenants
```

#### Returns

Returns an array containing all tenants if the specified instance exists.
Returns [an error](#errors) otherwise.

```json
[
  {
    "id": "system",
    "name": "My Tenant"
  },
  {
    "id": "tenant1",
    "name": "My Other Tenant"
  }
]
```

## Tenants

A tenant describes a virtual partition of a CxEngage instance. A tenant may be
provided for each client-organization. A user of CxEngage may have access to
multiple tenants across many instances.

#### Attributes

Name | Type | Description
--- | --- | ---
**id** | **string** | Unique identifier
**name** | **string** | Human-friendly name of the pattern
**rate-limit** | **number** | Rate Limit of Events per second

> Example Object

```json
{
  "id": "tenant1",
  "name": "My Tenant"
}
```

[More on Tenants >](http://docs.cxengage.com/docs/platform/tenants/)

### Create a Tenant

Creates a tenant object.

> Definition

```
POST /1.0/tenants
```
#### Arguments

Name | Description
-- | --
**id** | Unique identifier
**name** | Human-friendly name of the instance
rate-limit | Rate Limit of Events per second

> Example Request

```
curl -X POST /1.0/tenants \
     -H 'Content-Type: application/json' \
     -d '{"id": "tenant1", "name": "My Tenant"}'
```

#### Returns

Returns a tenant object if successful, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "tenant1",
  "name": "My Tenant"
}
```

### Retrieve a Tenant

Retrieves the details of an existing tenant.

> Definition

```
GET /1.0/tenants/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Tenant ID

> Example Request

```
curl -XGET /1.0/tenant/tenant1
```

#### Returns

Returns a tenant object if specified tenant exists. Returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "tenant1",
  "name": "My Tenant"
}
```

### Update a Tenant

Updates an existing tenant by setting the values of the provided parameters passed. Any parameters not provided will be unchanged.

> Definition

```
PUT /1.0/tenants/tenant1
```

#### Arguments

Name | Description
-- | --
name | Human-friendly name of the instance
rate-limit | Rate Limit of Events per second

> Example Request

```
curl -X PUT /1.0/tenants/tenant1 \
     -H 'Content-Type: application/json' \
     -d '{"name": "Test Tenant"}'
```

#### Returns

Returns the tenant object if the update succeeded, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "tenant1",
  "name": "Test Tenant"
}
```

### Delete a Tenant

Permanently deletes a tenant. It cannot be undone. Immediately stops processing events for this tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
DELETE /1.0/tenants/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Tenant ID

> Example Request

```
curl -IX DELETE /1.0/tenants/tenant1
```

#### Returns

Returns an **HTTP 204** if successful. Otherwise, returns [an error](#errors).

### List All Tenants

Returns a list of all tenants.

> Definition

```
GET /1.0/tenants
```

#### Arguments

None.

> Example Request

```
curl -XGET /1.0/tenants
```

#### Returns

Returns an array containing all tenants.

```json
[
  {
    "id": "tenant1",
    "name": "Test Tenant",
  },
  {
    "id": "system",
    "name": "Main Tenant",
  }
]
```

### List Users of a Tenant

Returns a list of all users for a specified tenant.

> Definition

```
GET /1.0/tenants/{{id}}/users
```

#### Arguments

Name | Description
--- | ---
**id** | Tenant ID

> Example Request

```
curl -XGET /1.0/tenants/tenant1/users
```

#### Returns

Returns an array containing all users if the specified tenant exists.
Returns [an error](#errors) otherwise.

```json
[
  "ian@userevents.com",
  "admin@userevents.com"
]
```

### Retrieve Instance of a Tenant

Retrieves the details of the current instance of an existing tenant.

> Definition

```
GET /1.0/tenants/{{id}}/instance
```

#### Arguments

Name | Description
--- | ---
**id** | Tenant ID

> Example Request

```
curl -XGET /1.0/tenant/tenant1/instance
```

#### Returns

Retrieves the instance object if specified tenant exists and has a current
instance. Returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "IN2",
  "name": "My Instance",
  "zk": "localhost:2181",
  "redis": "redis://localhost:6379"
}
```

### Add Tenant to Instance

Adds a tenant to an instance. This will upsert any existing instance. Any
existing state related to this tenant on the original instance will be lost.

> Definition

```
POST /1.0/tenants/{{tid}}/instance
```

#### Arguments

Name | Description
--- | ---
**id** | Instance ID

> Example Request

```
curl -X POST /1.0/tenants/tenant1/instance \
     -H 'Content-Type: application/json' \
     -d '{"id": "IN2"}'
```

#### Returns

Returns a JSON Object with keys `instance` and `tenant` if successful, returns
[an error](#error) otherwise.

> Example Response

```json
{
  "tenant": "tenant1",
  "instance": "IN2"
}
```

### Remove Tenant from Instance

Removes a tenant from an instance. This will remove any existing state on the
instance for this tenant.

> Definition

```
DELETE /1.0/tenants/{{id}}/instance
```

#### Arguments

Name | Description
--- | ---
**id** | Tenant ID

> Example Request

```
curl -IX DELETE /1.0/tenants/tenant1/instance
```

#### Returns

Returns an **HTTP 204** if successful. Otherwise, returns [an error](#errors).

## Users

### Create a User

### Retrieve a User

### Update a User

### Delete a User

### List All Users

### Add User to Tenant

### Remove User from Tenant

## Integrations

### Create an Integration

### Retrieve an Integration

### Update an Integration

### Delete an Integration

### List All Integrations

# Service Management

## Nodes

### Create a Node

### Retrieve a Node

### Update a Node

### Delete a Node

### List All Nodes

### Ping a Node

## Services

### Create a Service

### Retrieve a Service

### Update a Service

### Delete a Service

### List All Services

### Start a Service

### Stop a Service

### Monitor a Service

### List All Processes

### Start All Services

### Stop All Services

### Monitor All Services

## Processes

### Create a Process

### Retrieve a Process

### Delete a Process

### List All Processes

### Start a Process

### Stop a Process

### Monitor a Process
