/*
 * Code generated by Microsoft (R) AutoRest Code Generator 1.2.2.0
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

'use strict';

/**
 * Luis entity. Look at https://www.luis.ai/Help for more information.
 *
 */
class Entity {
  /**
   * Create a Entity.
   * @member {string} [role] Role of the entity.
   * @member {string} [entity] Entity extracted by LUIS.
   * @member {string} type Type of the entity.
   * @member {number} [startIndex] Start index of the entity in the LUIS query
   * string.
   * @member {number} [endIndex] End index of the entity in the LUIS query
   * string.
   * @member {number} [score] Score assigned by LUIS to detected entity.
   * @member {object} [resolution] A machine interpretable resolution of the
   * entity.  For example the string "one thousand" would have the resolution
   * "1000".  The exact form of the resolution is defined by the entity type
   * and is documented here: https://www.luis.ai/Help#PreBuiltEntities.
   */
  constructor() {
  }

  /**
   * Defines the metadata of Entity
   *
   * @returns {object} metadata of Entity
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'Entity',
      type: {
        name: 'Composite',
        className: 'Entity',
        modelProperties: {
          role: {
            required: false,
            serializedName: 'role',
            type: {
              name: 'String'
            }
          },
          entity: {
            required: false,
            serializedName: 'entity',
            type: {
              name: 'String'
            }
          },
          type: {
            required: true,
            serializedName: 'type',
            type: {
              name: 'String'
            }
          },
          startIndex: {
            required: false,
            serializedName: 'startIndex',
            type: {
              name: 'Number'
            }
          },
          endIndex: {
            required: false,
            serializedName: 'endIndex',
            type: {
              name: 'Number'
            }
          },
          score: {
            required: false,
            serializedName: 'score',
            type: {
              name: 'Number'
            }
          },
          resolution: {
            required: false,
            serializedName: 'resolution',
            type: {
              name: 'Dictionary',
              value: {
                  required: false,
                  serializedName: 'ObjectElementType',
                  type: {
                    name: 'Object'
                  }
              }
            }
          }
        }
      }
    };
  }
}

module.exports = Entity;
