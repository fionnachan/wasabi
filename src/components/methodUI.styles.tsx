import styled from "styled-components";

export const MethodWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding: var(--space-m);
  border: 1px solid;
  border-radius: 0.4rem;
`;

export const Banner = styled.div`
  font-size: var(--font-size-s);
  background: var(--pastel-gradient);
  padding: var(--space-xs) var(--space-s);
  border-radius: 8px;
  margin: 0 0 var(--space-s);
`;

export const Caption = styled.p`
  margin-top: 0;

  code {
    font-size: var(--font-size-s);
  }
`;

export const Desc = styled.p`
  font-size: var(--font-size-s);
  line-height: 1.3;
  margin: 0 0 var(--space-xxs);
`;

export const Arg = styled.div`
  margin-bottom: var(--space-l);
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-m);
`;

export const Button = styled.button`
  color: var(--grey-darkest);
  font-weight: bold;
  background: var(--color-primary);
  padding: var(--space-xs) var(--space-m);
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: var(--color-primary-light);
  }

  &[disabled] {
    background: var(--grey-light);
    cursor: default;
  }
`;

export const Return = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font-size-s);
  column-gap: 0.2rem;

  ${Desc} {
    margin: 0;
  }
`;

export const ReturnHeader = styled.p`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin: 0;
`;

export const ResultWrapper = styled.div`
  margin-top: var(--space-l);

  p {
    font-size: var(--font-size-xs);
    margin: 0 0 var(--space-s);
  }
`;

export const Result = styled.pre`
  font-size: var(--font-size-s);
  padding: var(--space-m);
  border: 1px solid var(--grey-light);
  border-radius: 4px;
  margin: 0;
  white-space: pre-wrap;
`;
