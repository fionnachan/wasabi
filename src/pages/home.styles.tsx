import styled, { css } from "styled-components";

export const Section = styled.div`
  width: 100%;
`;

export const Header = styled.div`
  text-align: center;
  h3 {
    margin-bottom: var(--space-xs);
  }
`;

export const InfoTable = styled.div`
  position: fixed;
  max-height: 100vh;
  width: 100%;
  left: 0;
  bottom: 0;
  background: rgba(255, 250, 200, 0.95);
  padding: var(--space-xl);
  border-top: 3px solid #ffffdd;
  z-index: 2;
  p {
    margin-top: 0;
  }

  input,
  select {
    flex: 1 0 auto;
    width: auto;
  }
`;

export const ToggleButton = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  top: -35px;
  right: 0;
  background: var(--pastel-gradient);
  border: 1px solid var(--grey-darkest);
  border-radius: 50%;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    top: 50%;
    left: 50%;
    margin-top: -3px;
    margin-left: -6px;
    border-top: 2px solid var(--grey-darkest);
    border-left: 2px solid var(--grey-darkest);
    transform: rotate(45deg);
    transition: margin-top 0.2s, transform 0.2s;
  }

  &:hover::after {
    margin-top: -9px;
    transform: rotate(225deg);
  }
`;

export const InfoTableInner = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  font-size: var(--font-size-m);
  gap: var(--space-xs);
  max-width: 1000px;
  margin: auto;

  &[data-show="false"] {
    height: 2rem;

    ${ToggleButton} {
      &::after {
        margin-top: -9px;
        transform: rotate(225deg);
      }

      &:hover::after {
        margin-top: -3px;
        transform: rotate(45deg);
      }
    }
  }

  > div {
    display: flex;
    align-items: center;

    > span:first-child {
      flex: 0 0 auto;
      width: 10rem;
    }

    @media screen and (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;

      > span:first-child {
        width: auto;
      }
    }
  }

  h2 {
    margin-top: 0;
  }
`;

export const Endpoints = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Endpoint = styled.div`
  input:last-child {
    width: 4rem;
  }
`;

export const Methods = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
`;

export const AccountList = styled.ol`
  display: flex;
  flex-wrap: wrap;
  column-gap: var(--space-m);
  row-gap: var(--space-xxs);
  align-items: center;
  width: 100%;
  font-size: var(--font-size-s);
  padding: 0;
  margin: 0;
  overflow: hidden;

  li {
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

export const InterfaceInputWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 25rem;
  height: auto;
  background: white;
  border: 1px solid var(--grey-lighter);
  border-radius: 6px;
  margin-bottom: var(--space-l);
`;

const InterfaceInputBoxSharedStyles = css`
  position: absolute;
  width: 100%;
  height: 100%;
  line-height: 1.2;
  font-size: var(--font-size-s);
  font-family: monospace;
  padding: var(--space-m);
  border: none;
  border-radius: 6px;
  margin: 0;
  overflow: auto;
  tab-size: 2;
`;

export const InterfaceInputContentWrapper = styled.pre`
  ${InterfaceInputBoxSharedStyles}
`;

export const InterfaceInputContent = styled.code`
  display: block;
  font-size: var(--font-size-s);
  background-color: white;
  padding: 0;
  z-index: 0;
`;

export const InterfaceInput = styled.textarea`
  ${InterfaceInputBoxSharedStyles}
  color: transparent;
  background: transparent;
  caret-color: var(--green);
  resize: none;
  z-index: 1;
  white-space: nowrap;

  ::selection {
    color: var(--color-text-main);
  }
`;

export const InterfaceInputErrorWrapper = styled.p`
  color: var(--color-error);
`;

export const Button = styled.button`
  font-size: var(--font-size-s);
  font-weight: bold;
  color: var(--color-text-main);
  background: var(--grey-lighter);
  border: 1px solid var(--grey-light);
  border-radius: 4px;
  margin-left: var(--space-xs);
  &:hover {
    background: var(--grey-lightest);
  }
  &[data-active="true"] {
    background: var(--pastel-gradient);
    background-size: 6rem;
    border-color: #f3e0c3;
    transition: background 0.25s;
    cursor: default;

    &:hover {
      background-position: 100%;
    }
  }
`;

export const SubmitButton = styled(Button)`
  font-size: var(--font-size-m);
  padding: var(--space-s) var(--space-xl);
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  margin-left: 0;
  cursor: pointer;

  &:hover {
    background-color: var(--color-primary-light);
    border-color: var(--color-primary-light);
  }
`;

export const TxButtonsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-xl);
`;

export const TxButton = styled.button`
  min-width: 10rem;
  font-size: var(--font-size-m);
  font-weight: bold;
  color: var(--color-text-main);
  background: var(--pastel-gradient);
  background-size: 16rem;
  padding: var(--space-s);
  border: 1px solid #f3e0c3;
  border-radius: 4px;
  transition: background 0.25s;
  &:hover {
    background-position: 100%;
  }
  &[disabled] {
    background: var(--grey-lighter);
    border-color: var(--grey-light);
    cursor: default;
  }
`;
