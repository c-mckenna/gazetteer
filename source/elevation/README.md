## This is not considered production ready yet.

This loads up Solr with the elevation datasets. The information is retrieved from the
FME server that hosts a bespoke service. It is envisaged that this will be
configured to run on a schedule, say nightly.

It can either be added as a cron job in its own right or tacked onto
schedule_provisioning