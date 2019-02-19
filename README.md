# WebPhapp  
[![Build Status](https://travis-ci.org/Pharmachain/WebPhapp.svg?branch=master)](https://travis-ci.org/Pharmachain/WebPhapp/)  

The Pharmachain web app!

## MySQL DB Connection  
In the directory `Webphapp/Webphapp/backend/` is the file `connections.js`. This file holds the connection strings for the database. To have any database functionality, you need to insert proper credentials to this file. You can find the working `connections.js` file in the GDrive folder. If connection strings are not provided, the backend falls back on filling in dummy data. When you commit future changes, make sure not to push the connection strings. This should be a hard mistake to make because the file is listed in `.gitignore`.

### Blockchain Connection  
In the same `connections.js` file, there is a boolean value `Blockchain`. When false, the backend routes all use the dummy data that exists in `WebPhapp/backend/dummy_data`. When true, the backend routes connect to the local blockchain instance. Not all functions are connected to the blockchain yet, so when `Blockchain: true`, some functions still use the dummy data. See [Running the Blockchain](#running-the-blockchain) for details on how to interact with the blockchain properly. Better yet, ask Jeb.

## Unit Testing  
Run all tests before changing any files, opening a PR, updating a PR, and reviewing a PR.  

All tests can be ran together by calling `./testRunner.sh`. This automatically wil call `npm install` for both the frontend and backend. To skip this step, call `./testRunner.sh -n` instead.  

Back end tests individually:  
```
cd WebPhapp/backend/
npm install
npm run test
```  

Front end tests individually:  
```
cd WebPhapp/client/
npm install
npm run test
```

Blockchain test development is in progress.  

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
- Go into your quorum-maker folder:
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
- Deploy newly compiled contracts to chain.
```
node deploy.js
```

- Write prescription to blockchain example:
```
node write_prescription.js 0 1 2 34 '300MG' 1542357074 200 8 false 0
```

- Read prescription by index example:
```
node read_prescrip_index.js 0
```

- Read prescription of a specific type, value. For example, return prescriptions with patientID = 0:
```
node read_prescription_type_value.js 0 0
```

- Update prescription with new values:
```
node update_prescription.js 0 1 2 4 true 8
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
