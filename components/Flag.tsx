import { getAssetUrl } from '@/lib/assets';

export default function Flag(props: { flag?: string | null, regionLabel: string }) {
  const id = props.flag || '10c75c82-b086-4b42-b930-dce7533e1f01';
  const url = getAssetUrl(id, { w: 150, format: "auto" });
  const label = props.flag ? `Flag of ${props.regionLabel}` : "Placeholder flag";
  return (<img src={url} alt={label} />)
}