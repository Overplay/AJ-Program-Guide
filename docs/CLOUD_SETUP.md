1. Clone the repo
2. set permissions to asahi asahi 775
3. npm update as asahi user
4. add the local.js file

# TWO Options
# 1:  setup a second mongo instance
- Different ports!

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
`sudo mongod --config /etc/mongodPGS.conf &`


# 2: Run as second DB on current mongo

just edit connectiosn to have different DB name than asahi and ensure ports are the SAME


## starting AJPGS
- run `pm2 start process.json`
- run `pm2 save` to ensure proper restarts if the server goes down


## Make sure to set up git remote as ssh for pm2 auto pull to work
