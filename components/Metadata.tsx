import { IDatasetCoverage } from "@/lib/types"
import { Badge } from "./wrapped";


type FrequencyBadgeProps = {
  coverage?: IDatasetCoverage
  hideNever?: boolean
}

export function FrequencyBadge({ coverage, hideNever = false }: FrequencyBadgeProps) {
  if (!coverage || !coverage.frequency || coverage.frequency == 'unknown') {
    return null;
  }
  if (coverage.frequency == 'never') {
    if (hideNever) {
      return null;
    }
    return <Badge bg="warning">not automated</Badge>
  }
  return <Badge bg="light">{coverage.frequency}</Badge>
}
