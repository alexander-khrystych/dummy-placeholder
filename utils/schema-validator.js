import { readFileSync } from 'fs'
import { resolve } from 'path'
import _ from 'lodash'
import { load } from 'js-yaml'
import addFormats from 'ajv-formats'
import Ajv2019 from "ajv/dist/2019"

export function validateSchema(schemaRelativePath, data) {
    const formatErrors = (errors) => {
        return errors.map((e) => {
            const where = `data${e.instancePath}`
            const detail = _.isEmpty(e.params) ? '' : ` ${JSON.stringify(e.params)}`
            return `${where} ${e.message}${detail}`
        })
    }

    const ajv = new Ajv2019({ allErrors: true, strict: 'log' })
    addFormats(ajv)
    
    const yamlSchema = load(readFileSync(resolve(`schemas/${schemaRelativePath}`), 'utf8'))
    const schema = ajv.compile(yamlSchema).schema

    const isValid = ajv.validate(schema, data)
    return {
        isValid,
        errors: isValid
            ? null
            : formatErrors(ajv.errors),
    }
}