1. Clone the repo
2. set permissions to asahi asahi 775
3. npm update as asahi user
4. add the local.js file
5. setup a second mongo instance

add this to a config file mongodPGS.conf  /etc

```
# Where and how to store data.
storage:
  dbPath: /var/lib/mongodbPGS
  journal:
    enabled: true
#  engine:
#  mmapv1:
#  wiredTiger:

# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongodPGS.log

# network interfaces
net:
  port: 27018
  bindIp: 127.0.0.1
  ```



in /var/lib
sudo mkdir mongodbPGS and chown/chgrp to mongodb


  run
`sudo mongod --config /etc/mongodPGS.conf`


//todo add it to pm2 and whatnot, also works with pm2 auto reload now 
