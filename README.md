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

There are scripts in the source directory.

To bootstrap copy and paste this code into a file and as the ec2-user in the /home/ec2-user, set it executable and run it.
After a couple of minutes you should have a running Solr Australian Gazetteer instance running that can be queried.
```bash
#!/bin/bash

DIRECTORY=gazetteer

if [ ! -d $DIRECTORY ]; then
  echo "Fetching gazetteer project"
  git clone https://github.com/Tomella/$DIRECTORY.git
else
  cd $DIRECTORY
  git pull
fi

# Download
cd $HOME/$DIRECTORY/deploy
bash install
```
It sets up proxying on an apache http server that was one of the requirements and the data is then available on http://<your_host_name>/select?indent=on&q=*:*&wt=json
A service is installed and set to autostart on reboot.


Naturally it would be expected that a client would consume the data.

Most of the installation process is conditional so it should be possible to blow parts away and redo it and there is a reasonable chance that it will fill in the gaps.
If not then that is left as an exercise for the user.

The default is to install from a PostGIS database and to isolate the credentials from this project it is expected that NLIG have 
pre-configured the EC2 instance with [secrets manager](https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html) as we use the variables to retrieve the Postgres credentials and other details.
 
We need the following details to read the PostGIS database:

```json
{
	"username":"<A_USER_NAME>",
	"password":"<A_PASSWORD>",
	"engine":"postgres",
	"host":"<A_HOST_NAME>",
	"port":5432,
	"dbname":"<THE_DB_NAME>"
}
```
