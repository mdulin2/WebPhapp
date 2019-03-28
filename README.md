# WebPhapp  
[![Build Status](https://travis-ci.org/Pharmachain/WebPhapp.svg?branch=master)](https://travis-ci.org/Pharmachain/WebPhapp/)  

The Pharmachain web app!

## MySQL DB Connection  
In the directory `Webphapp/Webphapp/backend/` is the file `connections.js`. This file holds the connection strings for the database. To have any database functionality, you need to insert proper credentials to this file. You can find the working `connections.js` file in the GDrive folder. If connection strings are not provided, the backend falls back to dummy data. When you commit future changes, make sure not to push the connection strings. This should be a hard mistake to make because the file is listed in `.gitignore`.

### Blockchain Connection  
In the same `connections.js` file, there is a boolean value `Blockchain`. When false, the backend routes all use the dummy data that exists in `WebPhapp/backend/dummy_data`. When true, the backend routes connect to the local blockchain instance. Not all functions are connected to the blockchain yet, so when `Blockchain: true`, some functions still use the dummy data. See [Running the Blockchain](#running-the-blockchain) for details on how to interact with the blockchain properly. Better yet, ask Jeb.

## Unit Testing  
Run all tests before changing any files, opening a PR, updating a PR, and reviewing a PR.  

All tests are managed by the script `./testRunner.sh`. `npm install` is automatically called for both front and back end tests unless the flag `-n` is included. Any combination of tests can be ran. Here are some examples:

Run all tests:
```
sudo ./testRunner.sh
```

Back end tests individually:  
```
sudo ./testRunner.sh -b
```  

Front end tests individually:  
```
sudo ./testRunner.sh -f
```

Blockchain tests individually:
```
sudo ./testRunner.sh -c
```

Running front and backend tests without `npm install`:
```
sudo ./testRunner.sh -nfb
```

Important: ensure that the `connections.js` file has the desired values. When `Blockchain = true`, the backend tests fail due to timeout. This is because adding prescriptions to the blockchain takes a long time, not necessarily that there is an issue. Furthermore, ensure that the `settings.js` has `env: 'test'` so that the routes are unauthenticated for testing. However, when developing, make sure that it is set to `dev`.  

### Troubleshooting

**Inotify Listener Error**
- Both the front and backend unit tests are run using npm. There is a potential error message you may get that looks like this:  
`npm ERR! No Space left on device`  

- This does not mean your machine ran out of disc space. It has something to do with inotify listeners.
To fix the issue, run this in your console:  
`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`  

- To read about why this is the case:  
https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers  

### Running the Blockchain
**Starting the Blockchain**
- Go into your quorum-maker folder. This folder must first exist (running `./testRunner.sh` clones this repo):
```
cd WebPhapp/quorum-maker/TestNetwork
```
- Start up the docker containers which serve as nodes in the network:
```
sudo docker-compose up &
```
- Unlock the nodes in the network so that you can run node scripts.
```
sudo ./modular.sh
```
**Compiling Contracts**
- When using a fresh install, or after changing solidity contracts,
you should recompile and test the contracts in the Pharmachain folder.
(Your blockchain should be running in already):
```
cd WebPhapp/PharmaChain
sudo truffle migrate
sudo truffle test
```
- Once the blockchain is updated with the newest compiled version of your contracts, you can use premade node.js scripts to interact with the blockchain.

**Premade Scripts**
- Deploy newly compiled contracts to chain. Must be done before running scripts.
```
sudo node deploy.js
```
- Deploy dummy data to blockchain, if the blockchain is empty.
```
sudo node load_data.js
```

- Write prescription to blockchain example:
```
sudo node write_prescription.js 0 1 2 14 '300MG' 1542357074 200 8 false 0
```

- Read prescription by index example:
```
sudo node read_prescrip_index.js 0
```

- Read prescription of a specific type, value. For example, return prescriptions with patientID = 0:
```
sudo node read_prescription_type_value.js 0 0
```

- Update prescription with new values:
```
sudo node update_prescription.js 0 1 2 4 true 8
```
**Troubleshooting Blockchain**
- If you see the following code:

```
rpc call eth_coinbase() on http://localhost:22000: Post http://localhost:22000: dial tcp 127.0.0.1:22000: connect: connection refused
```

Delete the quorum-maker folder, and reclone it.
```
cd WebPhapp/
sudo rm -r quorum-maker
git clone https://github.com/Pharmachain/quorum-maker
```

- If you see the following backend error:
```
error: TypeError: values.5.map is not a function
```
make sure you are running your backend with npm run start
not npm start.

**Default Users**
There are several users that are created in the DB. Here are the credentials for testing:
  Username-Password-role-role_id
- jackson, oz, Prescriber, 1  
- ozzie, smith, Patient, 1
- wizard, oz, Dispenser 1
- jackie, moon, Government, 1
- joe, bob, Admin, 1
