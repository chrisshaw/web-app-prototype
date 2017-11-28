const normalizr = require('normalizr')
const schema = normalizr.schema

const joinStudents = studentArray => studentArray.map(student => `s${student._id.split('/')[1]}`).join()

const focusArea = new schema.Entity('focusAreas', {}, { idAttribute: value => value._id })
const project = new schema.Entity(
    'projects',
    { fa: [ focusArea ] },
    { idAttribute: (value, parent) => `${joinStudents(parent.studentsOnPath)}p${value.name}`}
)
const path = new schema.Entity(
    'paths',
    { projectsOnPath: [ project ] },
    { idAttribute: (value, parent) => joinStudents(value.studentsOnPath) }
)
const response = [ path ]

module.exports = response