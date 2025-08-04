import { ReactElement } from "react";
import { LogsProps } from "./logs-types";

export function LogsComponent(props: LogsProps): ReactElement | null {
  const { queryResults, spec } = props;

  console.log("Panel data", queryResults);
  console.log("Panel spec", spec);

  // TODO: implement your awesome panel component here

  return <div>Panel goes here!</div>;
}