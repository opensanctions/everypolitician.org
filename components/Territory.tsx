import Link from "next/link";

import { ITerritoryInfo } from "@/lib/territory";

import { Badge } from "./wrapped";

type TerritoryProps = {
  territory?: ITerritoryInfo
  short?: boolean
  sentence?: boolean
}

function TerritoryName({ territory, short = true, sentence = false }: TerritoryProps) {
  if (!territory) {
    return null;
  }
  let label = territory.code;
  if (territory !== undefined) {
    label = short ? territory.label_short : territory.label_full;
    if (sentence) {
      label = territory.in_sentence || label;
    }
  }
  return <>{label}</>
}

function TerritoryBadge({ territory, short = true }: TerritoryProps) {
  if (!territory) {
    return null;
  }
  return <Badge bg="light"><TerritoryName territory={territory} short={short} /></Badge>
}

function TerritoryLink({ territory, short = true }: TerritoryProps) {
  if (!territory) {
    return null;
  }
  return <Link href={`/countries/${territory.code}`} prefetch={false}><TerritoryName territory={territory} short={short} /></Link>
}

export default class Territory {
  static Name = TerritoryName;
  static Link = TerritoryLink;
  static Badge = TerritoryBadge;
}