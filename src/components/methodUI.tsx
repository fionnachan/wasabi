import algosdk, {
  ABIMethodParams,
  ABIMethod,
  ABIResult,
  OnApplicationComplete,
} from "algosdk";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAccounts,
  selectAcctInUse,
  selectAlgod,
  selectAppId,
  selectWallet,
} from "../features/applicationSlice";
import {
  decorateDesc,
  parseInputValue,
  parseReturnValue,
} from "../utils/ABIutils";
import {
  Arg,
  Banner,
  Button,
  Caption,
  Desc,
  Footer,
  MethodWrapper,
  Result,
  ResultWrapper,
  Return,
  ReturnHeader,
} from "./methodUI.styles";

const MethodUI = ({
  method,
  contractMethod,
}: {
  method: ABIMethod;
  contractMethod: ABIMethod;
}) => {
  const refs = useRef<React.MutableRefObject<HTMLInputElement>[]>([]);
  const acctInUse = useSelector(selectAcctInUse);
  const algodClient = useSelector(selectAlgod);
  const appID = useSelector(selectAppId);
  const wallet = useSelector(selectWallet);
  const [loading, setLoading] = useState(false);
  const [numOfArgs, setNumOfArgs] = useState(0);
  const [queryResult, setQueryResult] = useState<ABIResult>();
  const isDeploy = method.name === "deploy";
  const dispatch = useDispatch();

  useEffect(() => {
    if (method && method.args) {
      setNumOfArgs(method.args.length);
      refs.current = refs.current.splice(0, method.args.length);
      for (let i = 0; i < method.args.length; i++) {
        refs.current[i] =
          refs.current[i] ||
          React.createRef<React.MutableRefObject<HTMLInputElement>>();
      }
      refs.current = refs.current.map(
        (item) =>
          item || React.createRef<React.MutableRefObject<HTMLInputElement>>()
      );
    }
  }, [method]);

  const performQuery = useCallback(async () => {
    if (!algodClient) {
      console.error("Algod client is not working");
      return;
    }

    if (!acctInUse) {
      console.error("Accounts are undefined");
      return;
    }

    if (loading) {
      return;
    }

    if (!appID && method.name !== "deploy") {
      return;
    }

    setLoading(true);

    const atc = new algosdk.AtomicTransactionComposer();

    const suggestedParams = await algodClient.getTransactionParams().do();

    const commonParams = {
      appID,
      sender: acctInUse.addr,
      suggestedParams,
      signer: algosdk.makeBasicAccountTransactionSigner(acctInUse),
    };

    const methodArgs = refs.current.map((ref) =>
      parseInputValue(
        ref.current.value,
        ref.current.getAttribute("data-arg-type")!
      )
    );

    let finalMethod = {
      method: contractMethod,
      methodArgs,
      ...commonParams,
    };

    // if (isDeploy) {
    // const approval = new Uint8Array(
    //   Buffer.from(contractBinaries.approval, "base64")
    // );
    // const clear = new Uint8Array(
    //   Buffer.from(contractBinaries.clear, "base64")
    // );
    //   finalMethod = Object.assign(finalMethod, {
    //     approvalProgram: approval,
    //     clearProgram: clear,
    //     numGlobalByteSlices: 2,
    //     numGlobalInts: 2,
    //     numLocalByteSlices: 0,
    //     numLocalInts: 16,
    //     onComplete: OnApplicationComplete.OptInOC,
    //   });
    // }

    // Simple call to the `add` method, method_args can be any type but _must_
    // match those in the method signature of the contract
    atc.addMethodCall(finalMethod);

    try {
      const result = await atc.execute(algodClient, 2);

      for (const idx in result.methodResults) {
        if (isDeploy) {
          dispatch(getAccounts(wallet!.id));
        }
        setQueryResult(result.methodResults[idx]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Query failed with error: ", error);
    }
  }, [acctInUse, appID, algodClient]);

  return (
    <MethodWrapper>
      {isDeploy && (
        <Banner>
          You can deploy the demo app using <code>deploy.sh</code> or{" "}
          <code>demo.sh</code>, or by using this UI.
        </Banner>
      )}
      <h3>{method.name}</h3>
      {method.description && (
        <Caption
          dangerouslySetInnerHTML={{ __html: decorateDesc(method.description) }}
        />
      )}
      {method.args.map((arg, index) => {
        return (
          <Arg key={arg.name}>
            <h4>
              {arg.name} ({arg.type})
            </h4>
            <Desc>{arg.description}</Desc>
            <input
              placeholder={`${arg.name} (${arg.type})`}
              data-arg-type={arg.type}
              ref={refs.current[index]}
              disabled={isDeploy && appID !== 0}
            ></input>
          </Arg>
        );
      })}
      <Footer>
        <Button
          onClick={performQuery}
          disabled={!acctInUse || loading || (isDeploy && appID !== 0)}
        >
          {isDeploy
            ? loading
              ? "Deploying..."
              : "Deploy"
            : loading
            ? "Querying..."
            : "Query"}
        </Button>
        <Return>
          <ReturnHeader>
            <span>Returns</span>
            <code>type {method.returns.type}</code>
          </ReturnHeader>{" "}
          - <Desc>{method.returns.description}</Desc>
        </Return>
      </Footer>
      {queryResult && (
        <ResultWrapper>
          <h4>Result</h4>
          {queryResult.txID && <p>Transaction ID: {queryResult.txID}</p>}
          <Result>
            {queryResult.returnValue
              ? parseReturnValue(
                  queryResult.returnValue,
                  method.returns.type.toString()
                )
              : queryResult.decodeError
              ? `${queryResult.decodeError.message}\n${queryResult.decodeError.stack}`
              : "No results"}
          </Result>
        </ResultWrapper>
      )}
    </MethodWrapper>
  );
};

export default MethodUI;
