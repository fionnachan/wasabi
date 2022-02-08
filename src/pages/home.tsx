import algosdk, { ABIContractParams, Account } from "algosdk";
import hljs from "highlight.js/lib/common";
import React, {
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import MethodUI from "../components/methodUI";
import {
  getAccounts,
  getAcctInfo,
  getWallets,
  selectAccounts,
  selectAcctInfo,
  selectAcctInUse,
  selectAlgod,
  selectAppId,
  selectContract,
  selectKmd,
  selectWallet,
  selectWallets,
  setAcctInUse,
  setAlgod,
  setAppId,
  setContract,
  setKmd,
  setWallet,
  Wallet,
} from "../features/applicationSlice";
import { useDeleteApp, useOptIntoApp, useOptOutApp } from "../hooks/account";
import { useDebounce } from "../hooks/utils";
import { CreatedApp } from "../types/AccountResponse";
import { isJsonString } from "../utils/stringUtils";
import {
  AccountList,
  Button,
  Endpoints,
  Endpoint,
  Header,
  InfoTable,
  InfoTableInner,
  Methods,
  Section,
  TxButton,
  TxButtonsWrapper,
  ToggleButton,
  InterfaceInput,
  SubmitButton,
  InterfaceInputWrapper,
  InterfaceInputContent,
  InterfaceInputContentWrapper,
  InterfaceInputErrorWrapper,
} from "./home.styles";

const Home = () => {
  const algodTokenRef = useRef<HTMLInputElement>(null);
  const algodServerRef = useRef<HTMLInputElement>(null);
  const algodPortRef = useRef<HTMLInputElement>(null);
  const kmdTokenRef = useRef<HTMLInputElement>(null);
  const kmdServerRef = useRef<HTMLInputElement>(null);
  const kmdPortRef = useRef<HTMLInputElement>(null);
  const walletIndexRef = useRef<HTMLSelectElement>(null);
  const interfaceInputContentWrapperRef = useRef<HTMLPreElement>(null);
  const interfaceInputContentRef = useRef<HTMLElement>(null);
  const interfaceInputRef = useRef<HTMLTextAreaElement>(null);
  const wallets = useSelector(selectWallets);
  const wallet = useSelector(selectWallet);
  const kmd = useSelector(selectKmd);
  const algodClient = useSelector(selectAlgod);
  const appId = useSelector(selectAppId);
  const accounts = useSelector(selectAccounts);
  const acctInUse = useSelector(selectAcctInUse);
  const acctInfo = useSelector(selectAcctInfo);
  const contract = useSelector(selectContract);
  const [acctCreatedApps, setAcctCreatedApps] = useState<CreatedApp[]>();
  const [selfDefinedAppId, setSelfDefinedAppId] = useState(0);
  const [acctOptedInApps, setAcctOptedInApps] = useState<number[]>();
  const [contractInterface, setContractInterface] = useState<string>();
  const [interfaceInputError, setInterfaceInputError] = useState<string | null>(
    null
  );
  const [optingIn, setOptingIn] = useState(false);
  const [optingOut, setOptingOut] = useState(false);
  const [optedIn, setOptedIn] = useState(false);
  const [deletingApp, setDeletingApp] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const dispatch = useDispatch();
  const optIntoApp = useOptIntoApp(setOptingIn);
  const optOutApp = useOptOutApp(setOptingOut);
  const deleteApp = useDeleteApp(setDeletingApp);

  const tabHandler = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (!(interfaceInputRef && interfaceInputRef.current)) {
        return;
      }
      const _el = interfaceInputRef.current;
      let code = _el.value;
      if (event.key.toLowerCase() === "tab") {
        event.preventDefault();
        const beforeTab = code.slice(0, _el.selectionStart);
        const afterTab = code.slice(_el.selectionEnd, _el.value.length);
        const cursorPos = _el.selectionEnd + 1;
        _el.value = beforeTab + "\t" + afterTab;
        _el.selectionStart = cursorPos;
        _el.selectionEnd = cursorPos;
        syncInputValue(_el.value);
      }
    },
    [interfaceInputRef]
  );

  const syncInputValue = useCallback(
    (_processedInputValue: string) => {
      if (interfaceInputContentRef && interfaceInputContentRef.current) {
        interfaceInputContentRef.current.innerHTML =
          hljs.highlightAuto(_processedInputValue).value;
      }
    },
    [interfaceInputContentRef]
  );

  const setScrollPosition = useCallback(() => {
    if (
      interfaceInputContentRef &&
      interfaceInputContentRef.current &&
      interfaceInputRef &&
      interfaceInputRef.current
    ) {
      const _inputValue = interfaceInputRef.current.value;
      const _processedInputValue =
        _inputValue[_inputValue.length - 1] === "\n"
          ? _inputValue + " "
          : _inputValue;
      syncInputValue(_processedInputValue);
    }
    if (
      interfaceInputContentWrapperRef &&
      interfaceInputContentWrapperRef.current &&
      interfaceInputRef &&
      interfaceInputRef.current
    ) {
      interfaceInputContentWrapperRef.current.scrollTop =
        interfaceInputRef.current.scrollTop;
      interfaceInputContentWrapperRef.current.scrollLeft =
        interfaceInputRef.current.scrollLeft;
    }
  }, [
    interfaceInputContentWrapperRef,
    interfaceInputContentRef,
    interfaceInputRef,
    syncInputValue,
  ]);

  const submitInterfaceInput = useCallback(() => {
    if (contractInterface) {
      // Parse the json file into an object, pass it to create an ABIContract object
      if (isJsonString(contractInterface)) {
        const _interface = JSON.parse(contractInterface) as ABIContractParams;
        try {
          const _contract = new algosdk.ABIContract(_interface);
          setInterfaceInputError(null);
          dispatch(setContract(_contract));
        } catch (error) {
          setInterfaceInputError("Contract interface input is invalid.");
        }
      } else {
        setInterfaceInputError("Contract interface input is invalid.");
      }
    }
  }, [contractInterface]);

  const interfaceInputChangeHandler = useCallback(() => {
    if (interfaceInputError) {
      setInterfaceInputError(null);
    }
    if (interfaceInputRef && interfaceInputRef.current) {
      setContractInterface(interfaceInputRef.current.value);
    }
    setScrollPosition();
  }, [setScrollPosition, interfaceInputError]);

  const debouncedInterfaceInputChangeHandler = useDebounce(
    interfaceInputChangeHandler,
    10
  );
  const debouncedInterfaceInputScrollHandler = useDebounce(
    setScrollPosition,
    10
  );

  const appIdButtonClickHandler = (_appId: number) => {
    dispatch(setAppId(_appId));
    setSelfDefinedAppId(_appId);
  };

  const chooseAcct = useCallback(
    async (acct: Account) => {
      if (acct !== acctInUse) {
        dispatch(setAcctInUse(acct));
      }
    },
    [acctInUse]
  );

  const setAcctApps = useCallback(async () => {
    if (acctInfo) {
      // get created apps
      let createdApps = [...acctInfo["created-apps"]];
      createdApps.unshift({ id: 0 });
      setAcctCreatedApps(createdApps);
      // get opted in apps
      const optedInApps = acctInfo["apps-local-state"].map((app) => app.id);
      setAcctOptedInApps(optedInApps);
    }
  }, [acctInfo]);

  useEffect(() => {
    if (acctOptedInApps && appId) {
      const hasOptedIn =
        acctOptedInApps.findIndex((val) => val === appId) !== -1;
      setOptedIn(hasOptedIn);
    }
  }, [appId, acctOptedInApps]);

  useEffect(() => {
    if (acctInUse && algodClient) {
      dispatch(getAcctInfo(null));
    }
  }, [acctInUse, algodClient]);

  useEffect(() => {
    setAcctApps();
  }, [setAcctApps]);

  useEffect(() => {
    if (kmd) {
      dispatch(getWallets(""));
    }
  }, [kmd]);

  useEffect(() => {
    if (
      wallets &&
      !wallet &&
      walletIndexRef.current &&
      walletIndexRef.current.value
    ) {
      dispatch(setWallet(Number(walletIndexRef.current.value)));
    }
  }, [wallets, walletIndexRef]);

  useEffect(() => {
    if (wallet) {
      dispatch(getAccounts(wallet.id));
    }
  }, [wallet]);

  const createNewAlgod = useCallback(() => {
    if (
      algodTokenRef.current &&
      algodTokenRef.current.value &&
      algodServerRef.current &&
      algodServerRef.current.value &&
      algodPortRef.current &&
      algodPortRef.current.value
    ) {
      dispatch(
        setAlgod(
          new algosdk.Algodv2(
            algodTokenRef.current.value,
            algodServerRef.current.value,
            algodPortRef.current.value
          )
        )
      );
    }
  }, [algodTokenRef, algodServerRef, algodPortRef]);

  const createNewKmd = useCallback(() => {
    if (
      kmdTokenRef.current &&
      kmdTokenRef.current.value &&
      kmdServerRef.current &&
      kmdServerRef.current.value &&
      kmdPortRef.current &&
      kmdPortRef.current.value
    ) {
      dispatch(
        setKmd(
          new algosdk.Kmd(
            kmdTokenRef.current.value,
            kmdServerRef.current.value,
            kmdPortRef.current.value
          )
        )
      );
    }
  }, [kmdTokenRef, kmdServerRef, kmdPortRef]);

  useEffect(() => {
    if (createNewAlgod) {
      createNewAlgod();
    }
    if (createNewKmd) {
      createNewKmd();
    }
  }, [createNewAlgod, createNewKmd]);

  return (
    <>
      <Header>
        <h1 className="title">WASABI </h1>
        <h3>ARC-4 App Method UI</h3>
        <span>
          Only available with sandbox and KMD before the launch of AVM 1.1
        </span>
      </Header>
      <InfoTable>
        <InfoTableInner data-show={showConfig}>
          <h2>Config</h2>
          <Endpoints>
            <Endpoint>
              <span>Algod: </span>
              <input
                type="text"
                value="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                ref={algodTokenRef}
                onChange={createNewAlgod}
              />
              <input
                type="text"
                value="http://localhost"
                ref={algodServerRef}
                onChange={createNewAlgod}
              />
              <input
                type="text"
                ref={algodPortRef}
                value="4001"
                onChange={createNewAlgod}
                placeholder="4001"
              />
            </Endpoint>
            <Endpoint>
              <span>KMD: </span>
              <input
                type="text"
                value="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                ref={kmdTokenRef}
                onChange={createNewKmd}
              />
              <input
                type="text"
                value="http://localhost"
                ref={kmdServerRef}
                onChange={createNewKmd}
              />
              <input
                type="text"
                ref={kmdPortRef}
                value="4002"
                onChange={createNewKmd}
                placeholder="4002"
              />
            </Endpoint>
          </Endpoints>
          {wallets && (
            <div>
              <span>KMD Wallets</span>
              <select name="wallets" ref={walletIndexRef}>
                {wallets.map((wallet: Wallet, index: number) => (
                  <option key={wallet.id} value={index}>
                    {wallet.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {wallets && (
            <div>
              <span>KMD Status: </span>
              <span>
                {wallet
                  ? accounts
                    ? "connected"
                    : "connecting..."
                  : "disconnected"}
              </span>
            </div>
          )}
          {accounts && (
            <div>
              <span className="valign-top">KMD accounts: </span>
              <AccountList>
                {accounts.map((acct) => (
                  <li key={acct.addr}>
                    <span>{acct.addr}</span>
                    <Button
                      onClick={() => chooseAcct(acct)}
                      data-active={acctInUse === acct}
                    >
                      {acctInUse === acct ? "Signer" : "Use"}
                    </Button>
                  </li>
                ))}
              </AccountList>
            </div>
          )}
          {acctInUse && acctCreatedApps && (
            <div>
              <span className="valign-top">Apps created by Account: </span>
              <AccountList>
                {acctCreatedApps.map((app: CreatedApp) => (
                  <li key={app.id}>
                    <span>App ID: {app.id}</span>
                    <Button
                      onClick={() => appIdButtonClickHandler(app.id)}
                      data-active={appId === app.id}
                    >
                      {appId === app.id ? "Current" : "Use"}
                    </Button>
                  </li>
                ))}
              </AccountList>
            </div>
          )}
          {acctInUse && (
            <>
              <div>
                <span>Self-defined App ID: </span>
                <div>
                  <input
                    type="number"
                    defaultValue={selfDefinedAppId}
                    onChange={(event) =>
                      setSelfDefinedAppId(Number(event.target.value))
                    }
                  />
                  <Button
                    onClick={() => dispatch(setAppId(selfDefinedAppId))}
                    data-active={appId === selfDefinedAppId}
                  >
                    {appId === selfDefinedAppId ? "Current" : "Use"}
                  </Button>
                </div>
              </div>
              <div>
                <span>Opted-in Apps: </span>
                <div>
                  {acctOptedInApps && acctOptedInApps.length > 0
                    ? acctOptedInApps.join(", ")
                    : "None"}
                </div>
              </div>
            </>
          )}
          <ToggleButton onClick={() => setShowConfig(!showConfig)} />
        </InfoTableInner>
      </InfoTable>
      <Section>
        <h2>Contract Interface</h2>
        <InterfaceInputWrapper>
          <InterfaceInput
            placeholder="Add and submit your ARC-4 contract interface"
            onKeyDown={(event) => tabHandler(event)}
            onChange={debouncedInterfaceInputChangeHandler}
            onScroll={debouncedInterfaceInputScrollHandler}
            ref={interfaceInputRef}
            spellCheck={false}
          />
          <InterfaceInputContentWrapper
            aria-hidden={true}
            ref={interfaceInputContentWrapperRef}
          >
            <InterfaceInputContent
              className="language-json"
              ref={interfaceInputContentRef}
            ></InterfaceInputContent>
          </InterfaceInputContentWrapper>
        </InterfaceInputWrapper>
        {interfaceInputError && (
          <InterfaceInputErrorWrapper>
            {interfaceInputError}
          </InterfaceInputErrorWrapper>
        )}
        <SubmitButton onClick={submitInterfaceInput}>Submit</SubmitButton>
      </Section>
      {contract && (
        <>
          <Section>
            <h2>App Operations</h2>
            <TxButtonsWrapper>
              {optedIn ? (
                <TxButton
                  onClick={optOutApp}
                  disabled={optingOut || optingIn || !optedIn || appId === 0}
                >
                  {optingOut ? "Opting out..." : "Opt Out"}
                  {appId === 0 && " unavailable"}
                </TxButton>
              ) : (
                <TxButton
                  onClick={optIntoApp}
                  disabled={optingIn || optedIn || appId === 0}
                >
                  {optingIn ? "Opting in..." : "Opt in"}
                  {appId === 0 && " unavailable"}
                </TxButton>
              )}
              {acctCreatedApps &&
                acctCreatedApps
                  .map((app) => !!app.id && app.id)
                  .includes(appId) && (
                  <TxButton onClick={deleteApp} disabled={deletingApp}>
                    {deletingApp ? "Deleting app..." : "Delete app"}
                  </TxButton>
                )}
            </TxButtonsWrapper>
          </Section>
          <Section>
            <h2>Contract Methods</h2>
            <Methods>
              {contract.methods.map((method) => (
                <MethodUI key={method.name} method={method} />
              ))}
            </Methods>
          </Section>
        </>
      )}
    </>
  );
};

export default Home;
