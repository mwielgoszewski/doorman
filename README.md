# doorman

Doorman is an osquery fleet manager that allows administrators to remotely manage the osquery configurations retrieved by nodes. Administrators can dynamically configure the set of packs, queries, and/or file integrity monitoring target paths using tags. Doorman takes advantage of osquery's TLS configuration, logger, and distributed read/write endpoints, to give administrators visibility across a fleet of devices with minimal overhead and intrusiveness.

# at a glance

Doorman makes extensive use of tags. A node's configuration is dependent on the tags it shares with packs, queries, and/or file paths. As tags are added and/or removed, a node's configuration will change.

For example, it's possible to assign a set of packs and queries a `baseline` tag. To ensure all nodes then receive this baseline configuration, you simply assign the `baseline` tag to the nodes you wish to include.

![nodes](https://raw.githubusercontent.com/mwielgoszewski/doorman/master/docs/screenshots/nodes.png)

# state of the node

Click on any node to view its recent activity, original enrollment date, time of its last check-in, and the set of packs and queries that are configured for it. This view provides an "at-a-glance" view on the current state of a node.

![nodes](https://raw.githubusercontent.com/mwielgoszewski/doorman/master/docs/screenshots/node.png)


# caveats

Doorman is currently in alpha status. For one, it lacks the required authentication and authorization checks one would expect from a production, release-ready project. Second, there's still quite a few details to work out. For example, some features I think are needed:

* authentication / authorization model
* validation of query sql
* enrollment workflow for new nodes, import existing nodes
* learn about nodes based on result logs
* dashboards!!
* API client certificate authentication
* a built-in query profiler?