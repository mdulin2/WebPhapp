set -e # end script if any test fails

# File: testRunner.sh
# About: 
#   Call this script to run all tests developed for the project.
#   Make sure to call this from the top-level directory.
# Usage:
#   >>> testRunner.sh [-n]
#   the flag -n is optional: with it, "npm install" is not ran.
#


# Process the optional -n flag
has_t_option=false
while getopts :n opt; do
    case $opt in 
        n) has_t_option=true ;;
       \?) echo "Unknown option -$OPTARG"; exit 1;;
    esac
done
shift $(( OPTIND - 1 ))

# Frontend testing framework
echo "Running frontend tests..."
cd WebPhapp/client/
if ! $has_t_option; then
    npm install
fi
CI=true npm run test
cd ../../

# Call the backend testing framework
echo "Running backend tests..."
cd WebPhapp/backend/
if ! $has_t_option; then
    npm install
fi
npm run test
cd ../../
