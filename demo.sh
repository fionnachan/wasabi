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

# Deploy TestToken (supply 100.00) with CREATOR and capture APPID
APPID=$(${GOAL} app method -f ${CREATOR} --create --on-completion OptIn \
	--approval-prog ERC20.teal --clear-prog clear.teal \
	--global-byteslices 2 --global-ints 2 --local-byteslices 0 --local-ints 16 \
	--method "deploy(string,string,uint64,uint64)bool" \
	--arg '"TestToken"' --arg '"TT"' --arg 10000 --arg 2 \
	| grep 'Created app with app index' | awk '{print $6}' | tr -d '\r')

# OptIn to TestToken with USER1 and USER2
${GOAL} app optin --app-id ${APPID} -f ${USER1}
${GOAL} app optin --app-id ${APPID} -f ${USER2}

# Transfer 50.00 TestToken from CREATOR to USER1
${GOAL} app method --app-id ${APPID} -f ${CREATOR} \
	--method "transfer(account,uint64)bool" \
	--arg "${USER1}" --arg 5000

# Balance Of USER1
${GOAL} app method --app-id ${APPID} -f ${CREATOR} \
	--method "balanceOf(account)uint64" \
	--arg "${USER1}" --dryrun-dump -o balanceOf.dr

# Give USER2 an allowance of 10.00 TT from USER1
${GOAL} app method --app-id ${APPID} -f ${USER1} \
	--method "approve(account,uint64)bool" \
	--arg "${USER2}" --arg 1000

${GOAL} app method --app-id ${APPID} -f ${USER1} \
	--method "allowance(account,account)uint64" \
	--arg "${USER1}" --arg "${USER2}"

# USER2 TransferFrom USER1 to CREATOR
${GOAL} app method --app-id ${APPID} -f ${USER2} \
	--method "transferFrom(account,account,uint64)bool" \
	--arg "${USER1}" --arg "${CREATOR}" --arg 600 --dryrun-dump -o tf.dr

# USER2 TransferFrom USER1 to USER2
${GOAL} app method --app-id ${APPID} -f ${USER2} \
	--method "transferFrom(account,account,uint64)bool" \
	--arg "${USER1}" --arg "${USER2}" --arg 400

# CloseOut from APPID if app is not delete
# Note: The user still holds 40.00 TT, these are essentially burnt.
${GOAL} app closeout --app-id ${APPID} -f ${USER1}

# Transfer 4.00 TestToken from USER2 to CREATOR
${GOAL} app method --app-id ${APPID} -f ${USER2} \
	--method "transfer(account,uint64)bool" \
	--arg "${CREATOR}" --arg 400

# CloseOut from APPID if app is not delete
${GOAL} app closeout --app-id ${APPID} -f ${USER2}

# Delete TestToken
${GOAL} app delete --app-id ${APPID} -f ${CREATOR}

# ClearState from APPID if app is delete
${GOAL} app clear --app-id ${APPID} -f ${CREATOR}

