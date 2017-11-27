## This is not considered production ready yet.

This loads up Solr with the elevation datasets. The information is retrieved from the
FME server that hosts a bespoke service. It is envisaged that this will be
configured to run on a schedule, say nightly.

There is a second collection which is for metadata. The metadata is spread across multiple instances of Geonetwork
which makes it unweildly to deal with. The metadata loader aggregates the attributes of interest so that it
can be searched, observed and filtered in a timely and meaningful way by the users.

There are associated projects with this capability.

The apache configuration project has the proxying to expose the data for selection.
This, the Gazetteer project has the configuration for the Solr search (maybe we should rename the project)

Both elevation and metadata can be added as a cron job so that the jobs are run on a schedule. At the moment
the jobs are ad hoc until the business case has been developed.