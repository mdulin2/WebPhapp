#!/bin/bash
set -e # end script if any test fails

# File: testRunner.sh
# About: 
#   Call this script to run tests developed for the project.
#   Make sure to call this from the top-level directory.
# Usage:
#   >>> testRunner.sh [ -nfcb ]
#   all flags are optional: 
#   -n: "npm install" is not ran before any test (faster)
#   -f: frontend tests are ran
#   -c: blockchain tests are ran
#   -b: backend tests are ran
#   if none of [ -fcb] are specified, all tests are ran
# Example:
#   >>> ./testRunner.sh -ncb
#   This means run the tests for the backend without calling npm install.
#       Then run the blockchain tests. Order of flags does not matter.

# Process the optional flags
n_option=false
f_option=false
c_option=false
b_option=false
while getopts :nfcb opt; do
    case $opt in 
        n) n_option=true ;;
        f) f_option=true ;;
        c) c_option=true ;;
        b) b_option=true ;;
       \?) echo "Unknown option -$OPTARG"; exit 1;;
    esac
done
shift $(( OPTIND - 1 ))

# Check if test flags need to be set
if $f_option || $c_option || $b_option ; then
    :
else
    f_option=true;
    c_option=true;
    b_option=true;
fi


# Frontend testing
if $f_option; then
    echo "Running frontend tests..."

    cd WebPhapp/client/
    if ! $n_option; then
        npm install
    fi
    CI=true npm run test
    cd ../../
fi

# Backend testing
if $b_option; then
    echo "Running backend tests..."

    cd WebPhapp/backend/
    if ! $n_option; then
        npm install
    fi
    npm run test
    cd ../../
fi

# Blockchain testing
if $c_option; then
    echo "Running blockchain tests..."

    # Turn on the Quorum Network
    cd ./WebPhapp
    git clone https://github.com/Pharmachain/quorum-maker
    cd ./quorum-maker/TestNetwork
    sudo docker-compose up -d
    sleep 1m

    # Open the nodes up to be used
    sudo ./modular.sh

    # Run the test contracts
    cd ../../PharmaChain
    sudo truffle version
    sudo truffle test
    cd ../../
fi
