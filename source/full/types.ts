import { ReactChild, ReactChildren } from "react";

type ChildElement = ReactChild | ReactChildren | false | null;

export type ChildElements = ChildElement | Array<ChildElement>;
