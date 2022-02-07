import algosdk, { waitForConfirmation } from "algosdk";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAcctInfo,
  selectAcctInUse,
  selectAlgod,
  selectAppId,
} from "../features/applicationSlice";

export const useOptIntoApp = (
  setOptingIn: (arg0: boolean) => void
): (() => void) => {
  const algodClient = useSelector(selectAlgod);
  const appId = useSelector(selectAppId);
  const acctInUse = useSelector(selectAcctInUse);
  const dispatch = useDispatch();

  return useCallback(async () => {
    if (acctInUse && algodClient && appId) {
      setOptingIn(true);
      const suggestedParams = await algodClient.getTransactionParams().do();
      const optInTx = algosdk.makeApplicationOptInTxnFromObject({
        from: acctInUse.addr,
        appIndex: appId,
        suggestedParams,
      });
      const signedTx = algosdk.signTransaction(optInTx, acctInUse.sk);
      const { txId } = await algodClient.sendRawTransaction(signedTx.blob).do();
      const result = await waitForConfirmation(algodClient, txId, 2);
      setOptingIn(false);
      if (result["pool-error"]) {
        throw new Error("Opt-in Failed: " + result["pool-error"]);
      }
      if (result) {
        dispatch(getAcctInfo(null));
      }
    }
  }, [acctInUse, algodClient, appId]);
};

export const useOptOutApp = (
  setOptingOut: (arg0: boolean) => void
): (() => void) => {
  const algodClient = useSelector(selectAlgod);
  const appId = useSelector(selectAppId);
  const acctInUse = useSelector(selectAcctInUse);
  const dispatch = useDispatch();

  return useCallback(async () => {
    if (acctInUse && algodClient && appId) {
      setOptingOut(true);
      const suggestedParams = await algodClient.getTransactionParams().do();
      const optOutTx = algosdk.makeApplicationCloseOutTxnFromObject({
        from: acctInUse.addr,
        appIndex: appId,
        suggestedParams,
      });
      const signedTx = algosdk.signTransaction(optOutTx, acctInUse.sk);
      const { txId } = await algodClient.sendRawTransaction(signedTx.blob).do();
      const result = await waitForConfirmation(algodClient, txId, 2);
      setOptingOut(false);
      if (result["pool-error"]) {
        throw new Error("Close Out Failed: " + result["pool-error"]);
      }
      if (result) {
        dispatch(getAcctInfo(null));
      }
    }
  }, [acctInUse, algodClient, appId]);
};

export const useDeleteApp = (
  setDeletingApp: (arg0: boolean) => void
): (() => void) => {
  const algodClient = useSelector(selectAlgod);
  const appId = useSelector(selectAppId);
  const acctInUse = useSelector(selectAcctInUse);
  const dispatch = useDispatch();

  return useCallback(async () => {
    if (acctInUse && algodClient && appId) {
      setDeletingApp(true);
      const suggestedParams = await algodClient.getTransactionParams().do();
      const optOutTx = algosdk.makeApplicationDeleteTxnFromObject({
        from: acctInUse.addr,
        appIndex: appId,
        suggestedParams,
      });
      const signedTx = algosdk.signTransaction(optOutTx, acctInUse.sk);
      const { txId } = await algodClient.sendRawTransaction(signedTx.blob).do();
      const result = await waitForConfirmation(algodClient, txId, 2);
      setDeletingApp(false);
      if (result["pool-error"]) {
        throw new Error("Delete App Failed: " + result["pool-error"]);
      }
      if (result) {
        dispatch(getAcctInfo(null));
      }
    }
  }, [acctInUse, algodClient, appId]);
};
