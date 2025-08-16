
export interface IPropertyTypeDatum {
  group?: string
  label?: string
  plural?: string | null
  matchable?: boolean,
  maxLength?: number,
  pivot?: boolean,
  values?: { [name: string]: string }
}

/**
 * A property type, such as a string, email address, phone number,
 * URL or a related entity.
 */
export class PropertyType {
  static ENTITY = 'entity';

  public readonly name: string
  public readonly group: string | null
  public readonly grouped: boolean
  public readonly label: string
  public readonly plural: string
  public readonly matchable: boolean
  public readonly pivot: boolean
  public readonly maxLength: number | null
  public readonly values: Map<string, string>
  public readonly isEntity: boolean

  constructor(name: string, data: IPropertyTypeDatum) {
    this.name = name
    this.label = data.label || name
    this.plural = data.plural || this.label
    this.group = data.group || null
    this.grouped = data.group !== undefined
    this.matchable = !!data.matchable
    this.pivot = !!data.pivot
    this.maxLength = data.maxLength || null
    this.isEntity = name === PropertyType.ENTITY
    this.values = new Map<string, string>()

    if (data.values) {
      Object.entries(data.values).forEach(([value, label]) => {
        this.values.set(value, label)
      })
    }
  }

  getLabel(value: string | undefined | null): string {
      if (!value) {
          return ''
      }
      return this.values.get(value) || value
  }

  toString(): string {
    return this.name
  }
}