---
layout: docs
title: Authentication
prev_section: integrate
next_section: custom-events
permalink: /docs/authentication/
---

CxEngage uses standard OAuth 2.0 to authenticate requests. In order to
authenticate a user, you must provide your `client_id` and `client_secret`.

You can access your credentials by visiting the [CxEngage web
application](http://cxengage.net) and clicking on your avatar.

## Versioning

The current version of the Auth service is `1.0`.

`https://auth.cxengage.net/version`

## Acquiring an Access Token

Once you have your `client_id` and `client_secret`, you must make a Basic Auth
request where username=`client_id` and password=`client_secret`.

{% highlight http %}
POST /1.0/token HTTP/1.1
Host: auth.cxengage.net
Authorization: Basic VGlaSHFnWk9sdktZeVBSNytQamZlVzY2R..
Cache-Control: no-cache
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
{% endhighlight %}

### Response

{% highlight javascript %}
{
    "access_token": "J+m9cxrDzKNhU3Me62yYT7PrnKVRnYkqZ3Yyq0t11gO4",
    "token_type": "bearer",
    "expires_in": 3600
}
{% endhighlight %}

#### Access Token

This token will be used to make your authenticated requests.

#### Expires In

Each token will last 30 days. Until that token has expired, any requests for
new tokens will return this token.

## Making an Authenticated Request

Using your `access_token`, you can now make authenticated requests by adding the
HTTP header `Authorization: Bearer ACCESS_TOKEN`.

For instance,

{% highlight http %}
GET /1.0/tenants/test/event HTTP/1.1
Host: events.cxengage.net
Content-Type: application/json
Authorization: Bearer 9Kz0asLXPYn7R7Ubfean1fMDkGrWluUZBWOHiGMimCem
Cache-Control: no-cache

<no body>
{% endhighlight %}
