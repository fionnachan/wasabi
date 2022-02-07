#!/usr/bin/env bash

set -euxo pipefail

SB="${HOME}/sandbox/sandbox"
GOAL="${SB} goal"

ACCOUNTS_PK=($(${GOAL} account list | awk '{print $3}' | tr -d '\r'))

CREATOR=${ACCOUNTS_PK[0]}
USER1=${ACCOUNTS_PK[1]}
USER2=${ACCOUNTS_PK[2]}

# Copy contracts to sandbox
${SB} copyTo contracts/ERC20.teal
${SB} copyTo contracts/clear.teal

# Deploy DemoToken (supply 1000.00) with CREATOR and capture APPID
APPID=$(${GOAL} app method -f ${CREATOR} --create --on-completion OptIn \
	--approval-prog ERC20.teal --clear-prog clear.teal \
	--global-byteslices 2 --global-ints 2 --local-byteslices 0 --local-ints 16 \
	--method "deploy(string,string,uint64,uint64)bool" \
	--arg '"DemoToken"' --arg '"DT"' --arg 100000 --arg 2 \
	| grep 'Created app with app index' | awk '{print $6}' | tr -d '\r')

# OptIn USER1
${GOAL} app optin --app-id ${APPID} -f ${USER1}

# OptIn USER2
${GOAL} app optin --app-id ${APPID} -f ${USER2}

GH=$(${GOAL} node status | grep 'Genesis hash' | awk '{print $3}' | tr -d '\r')

jq ".+{\"networks\": {\"${GH}\": {\"appID\": ${APPID}}}}" contracts/ERC20_Interface.json > contracts/ERC20_Contract.json

