---
layout: platform
title: Integrations
prev_section: config-services
next_section: config-tenants
permalink: /4.2/docs/platform/config-integrations/
version: 4.2
categories: ['platform']
---
When adding an integration to the CxEngage Platform, one must provide a definition of the integration. What follows are the current definitions of the provided integrations:

### Echo

```json
{
  "type" : "echo",
  "display" : "Echo",
  "schema" : [ ],
  "endpoint" : {
    "name" : "echo",
    "type" : "echo",
    "display" : "Echo Endpoint",
    "params" : [ ],
    "sends" : {
      "message" : {
        "message" : {
          "type" : "optional"
        }
      }
    }
  }
}
```

### Generic

```json
{
  "type" : "generic",
  "display" : "Generic",
  "schema" : [ ],
  "endpoint" : {
    "name" : "generic",
    "type" : "generic",
    "display" : "Generic Endpoint",
    "params" : [ ],
    "sends" : {
      "message" : {
        "body" : {
          "type" : "mandatory"
        }
      },
      "fetch" : {
        "id" : {
          "type" : "mandatory"
        }
      }
    }
  }
}
```

### Datasift

```json
{
  "type" : "datasift",
  "display" : "DataSift",
  "schema" : [ {
    "label" : "Username",
    "param" : "username"
  }, {
    "label" : "API Key",
    "param" : "api-key",
    "type" : "password"
  } ],
  "listener" : {
    "name" : "datasift",
    "type" : "datasift",
    "display" : "DataSift Listener",
    "params" : [ "username", "api-key", "hash" ],
    "static-params" : [ "username", "api-key", "hash" ],
    "schema" : [ {
      "label" : "Stream Hash",
      "param" : "hash"
    } ]
  }
}
```

### Twilio

```json
{
  "type" : "twilio",
  "display" : "Twilio",
  "schema" : [ {
    "label" : "SID",
    "param" : "account"
  }, {
    "label" : "Token",
    "param" : "password",
    "type" : "password"
  } ],
  "endpoint" : {
    "name" : "twilio",
    "type" : "twilio",
    "display" : "Twilio Endpoint",
    "params" : [ "account", "password" ],
    "sends" : {
      "call" : {
        "to-phone-number" : {
          "type" : "mandatory"
        },
        "from-phone-number" : {
          "type" : "mandatory"
        },
        "message" : {
          "type" : "optional"
        },
        "url" : {
          "type" : "optional"
        }
      },
      "call-status" : {
        "sid" : {
          "type" : "mandatory"
        }
      },
      "sms" : {
        "to-phone-number" : {
          "type" : "mandatory"
        },
        "from-phone-number" : {
          "type" : "mandatory"
        },
        "message" : {
          "type" : "mandatory"
        }
      },
      "sms-status" : {
        "sid" : {
          "type" : "mandatory"
        }
      }
    },
    "static-params" : [ "account", "password" ],
    "redact" : [ "password" ]
  }
}
```

### Sendgrid

```json
{
  "type" : "sendgrid",
  "display" : "Sendgrid",
  "schema" : [ {
    "label" : "Account",
    "param" : "account"
  }, {
    "label" : "Password",
    "param" : "password",
    "type" : "password"
  } ],
  "endpoint" : {
    "name" : "sendgrid",
    "type" : "sendgrid",
    "display" : "Sendgrid Endpoint",
    "params" : [ "account", "password" ],
    "sends" : {
      "email" : {
        "to" : {
          "type" : "mandatory"
        },
        "toname" : {
          "type" : "optional"
        },
        "from" : {
          "type" : "mandatory"
        },
        "fromname" : {
          "type" : "optional"
        },
        "subject" : {
          "type" : "mandatory"
        },
        "message" : {
          "type" : "mandatory"
        },
        "html" : {
          "type" : "optional"
        }
      }
    },
    "redact" : [ "password" ],
    "static-params" : [ "account", "password" ]
  }
}
```

### Salesforce

```json
{
  "type" : "salesforce",
  "display" : "Salesforce",
  "schema" : [ {
    "label" : "Consumer Key",
    "param" : "consumer-key"
  }, {
    "label" : "Consumer Secret",
    "param" : "consumer-secret",
    "type" : "password"
  }, {
    "label" : "Username",
    "param" : "username"
  }, {
    "label" : "Password",
    "param" : "password",
    "type" : "password"
  }, {
    "label" : "Security Token",
    "param" : "secret-token",
    "type" : "password"
  } ],
  "endpoint" : {
    "name" : "salesforce",
    "type" : "salesforce",
    "display" : "Salesforce Endpoint",
    "params" : [ "consumer-key", "consumer-secret", "username", "password", "secret-token", "type" ],
    "sends" : {
      "task" : {
        "OwnerId" : {
          "type" : "mandatory",
          "description" : "Assigned To"
        },
        "WhoId" : {
          "type" : "mandatory",
          "description" : "Name"
        },
        "WhatId" : {
          "type" : "mandatory",
          "description" : "Related To"
        },
        "Subject" : {
          "type" : "mandatory",
          "description" : "Subject",
          "enum" : [ "Call", "Email", "Send Letter", "Send Quote", "Other" ]
        },
        "Status" : {
          "type" : "mandatory",
          "description" : "Status",
          "enum" : [ "Not Started", "In Progress", "Completed", "Waiting on someone else", "Deferred" ]
        },
        "Description" : {
          "type" : "mandatory",
          "description" : "Description"
        },
        "ActivityDate" : {
          "type" : "mandatory",
          "description" : "Due Date"
        },
        "Priority" : {
          "type" : "mandatory",
          "description" : "Priority",
          "enum" : [ "High", "Normal", "Low" ]
        }
      },
      "opportunity" : {
        "OwnerId" : {
          "type" : "mandatory"
        },
        "AccountId" : {
          "type" : "mandatory"
        },
        "CloseDate" : {
          "type" : "mandatory"
        },
        "Amount" : {
          "type" : "optional"
        },
        "StageName" : {
          "type" : "mandatory"
        }
      },
      "lead" : {
        "LastName" : {
          "type" : "mandatory"
        },
        "Company" : {
          "type" : "mandatory"
        },
        "FirstName" : {
          "type" : "mandatory"
        },
        "Status" : {
          "type" : "mandatory"
        },
        "Email" : {
          "type" : "optional"
        },
        "OwnerId" : {
          "type" : "mandatory"
        }
      },
      "case" : {
        "OwnerId" : {
          "type" : "mandatory"
        },
        "Status" : {
          "type" : "mandatory"
        },
        "Origin" : {
          "type" : "mandatory"
        },
        "Contact" : {
          "type" : "mandatory"
        },
        "Subject" : {
          "type" : "optional"
        }
      },
      "chatter" : {
        "user-id" : {
          "type" : "mandatory"
        },
        "text" : {
          "type" : "mandatory"
        }
      },
      "chatter-group" : {
        "group-id" : {
          "type" : "mandatory"
        },
        "text" : {
          "type" : "mandatory"
        }
      }
    },
    "redact" : [ "consumer-secret", "password", "secret-token" ],
    "static-params" : [ "consumer-key", "consumer-secret", "username", "password", "secret-token" ]
  },
  "listener" : {
    "name" : "salesforce",
    "type" : "salesforce",
    "display" : "Salesforce Listener",
    "params" : [ "topic", "mapping", "username", "password", "consumer-key", "consumer-secret", "secret-token" ],
    "static-params" : [ "consumer-key", "consumer-secret", "username", "password", "secret-token" ],
    "schema" : [ {
      "label" : "Push Topic",
      "param" : "topic"
    } ]
  }
}
```

### Pusher

```json
{
  "type" : "pusher",
  "display" : "Pusher",
  "schema" : [ {
    "label" : "Pusher API Key:",
    "param" : "key"
  }, {
    "label" : "Pusher API Secret:",
    "param" : "secret",
    "type" : "password"
  } ],
  "endpoint" : {
    "name" : "pusher",
    "type" : "pusher",
    "display" : "Pusher Endpoint",
    "params" : [ "key", "secret" ],
    "sends" : {
      "event" : {
        "channel" : {
          "type" : "mandatory"
        },
        "event" : {
          "type" : "mandatory"
        },
        "message" : {
          "type" : "optional"
        }
      }
    },
    "static-params" : [ "key", "secret" ],
    "redact" : [ "secret" ]
  },
  "listener" : {
    "name" : "pusher",
    "type" : "pusher",
    "display" : "Pusher Listener",
    "params" : [ "channel", "event" ],
    "static-params" : [ "channel", "event" ],
    "schema" : [ {
      "label" : "Channel",
      "param" : "channel"
    }, {
      "label" : "Event",
      "param" : "event"
    } ]
  }
}
```

### Timer

```json
{
  "type" : "timer",
  "display" : "Timer Endpoint",
  "schema" : [ ],
  "endpoint" : {
    "name" : "timer",
    "type" : "timer",
    "display" : "Timer Endpoint",
    "params" : [ ],
    "sends" : {
      "create" : {
        "id" : {
          "type" : "optional"
        },
        "then" : {
          "type" : "mandatory"
        },
        "trigger" : {
          "type" : "mandatory"
        }
      },
      "cancel" : {
        "id" : {
          "type" : "mandatory"
        }
      }
    },
    "static-params" : [ ]
  }
}
```
