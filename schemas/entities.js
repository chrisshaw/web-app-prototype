const normalizr = require('normalizr')
const schema = normalizr.schema

const course = new schema.Entity('courses', {}, { idAttribute: value => value._id })
const focusArea = new schema.Entity(
    'focusAreas',
    { course: course },
    { idAttribute: value => value._id }
)
const response = [ focusArea ]

module.exports = response