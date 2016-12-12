# gazetteer
Sets up a solr instance on AWS and loads up 300k+ features from GeoScience Australia Gazetteer service.

What do we assume? Lots of things really as this is the intial go at it.
* You have Java 8 installed to keep Solr happy.
* You have nodejs (and npm) installed to keep this happy.
* You have apache installed as we proxy through it to get to Solr (thus isolating the rest of Solr from the outside world)
* You have wget installed so we can pull down the Solr zip file
* You have git installed so we can pull down the projects.
* Your logon has sudo access (like ec2 user on AWS).

All up, you should only really need take a copy of the file /deploy/install, make it executable and run it. It works out of your home directory.

There are scripts in the source directory
