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

# On DO server, you need to add swap memory
- source: https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04
1. Check if swap enabled with `sudo swapon -s`
2. Check available mem with `df -h`
3. Create a swapfile :
  - `sudo fallocate -l 4G /swapfile`
4. Check it `ls -lh /swapfile`
5. Enable swap
  - `sudo chmod 600 /swapfile`
  - `sudo mkswap /swapfile`
  - `sudo swapon /swapfile`
 6. Make the Swap File permanent (in case of reboot)
  - `sudo vi /etc/fstab`
  - at the end of the file add `/swapfile   none    swap    sw    0   0`
  - Save and close!



## starting AJPGS
- run `pm2 start process.json`
- run `pm2 save` to ensure proper restarts if the server goes down


## Make sure to set up git remote as ssh for pm2 auto pull to work
