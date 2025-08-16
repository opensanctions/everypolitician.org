import { Schema, ISchemaDatum } from './schema'
import { Entity, IEntityDatum } from './entity'
import { Property } from './property'
import { PropertyType, IPropertyTypeDatum } from './type'


export interface IModelDatum {
  schemata: { [name: string]: ISchemaDatum }
  types: { [name: string]: IPropertyTypeDatum }
}

export class ModelSingleton {
  public static instance?: Model
}

export class Model {
  public readonly schemata: { [x: string]: Schema | undefined } = {}
  public readonly types: { [x: string]: PropertyType } = {}

  constructor(config: IModelDatum) {
    this.types = {}
    Object.entries(config.types).forEach(
      ([typeName, typeData]) => {
        this.types[typeName] = new PropertyType(typeName, typeData)
      }
    )

    this.schemata = {}
    Object.entries(config.schemata).forEach(
      ([schemaName, schema]) => {
        this.schemata[schemaName] = new Schema(this, schemaName, schema)
      }
    )
  }

  getSchema(schemaName: string | null | undefined | Schema): Schema {
    if (schemaName === null || schemaName === undefined) {
      throw new Error('Invalid schema.')
    }
    if (schemaName instanceof Schema) {
      return schemaName
    }
    const schema = this.schemata[schemaName];
    if (schema === undefined) {
      throw new Error('No such schema: ' + schemaName)
    }
    return schema;
  }

  hasSchema(schemaName: string | null | undefined): boolean {
    try {
      this.getSchema(schemaName)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get a list of all schemata.
   */
  getSchemata(): Schema[] {
    return Object.keys(this.schemata)
      .map((name) => this.schemata[name])
      .filter(Schema.isSchema)
  }

  /**
   * Get a list of all unique properties.
   */
  getProperties(): Property[] {
    const qnames = new Map<string, Property>()
    this.getSchemata().forEach((schema) => {
      schema.getProperties().forEach((prop) => {
        qnames.set(prop.qname, prop)
      })
    })
    return Array.from(qnames.values())
  }

  /**
   * Get a particular property type.
   *
   * @param type name of the type
   */
  getType(type: string | PropertyType): PropertyType {
    if (type instanceof PropertyType) {
      return type;
    }
    return this.types[type]
  }

  /**
   * Convert a raw JSON object to an entity proxy.
   *
   * @param raw entity source data
   */
  getEntity(raw: IEntityDatum | Entity): Entity {
    if (raw instanceof Entity) {
      return raw
    } else {
      return new Entity(this, raw)
    }
  }
}
