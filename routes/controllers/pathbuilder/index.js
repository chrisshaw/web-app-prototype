'use strict'

// const testData = require('./test-data.js')
const queries = require('./queries.js')
const arango = require('./arango-helpers.js')
const query = arango.aql
const toposort = require('topsort')

const step1_findGoalSegments = async (projectStandards, student, depth) => {
    const goalSegments = await query(queries.findShortSegments(projectStandards, projectStandards, student, depth))
    return goalSegments
}

const step2_findStartSegments = async (currentStandards, projectStandards, student, depth) => {
    const startSegments = await query(queries.findShortSegments(currentStandards, projectStandards, student, depth))
    return startSegments
}

const step3_getFullListOfBridgeStandards = (goalSegments, startSegments) => {
    const combinedSegments = [...goalSegments, ...startSegments]
    const bridgeStandardArray = combinedSegments.reduce( (all, currentSegment) => {
        return [...all, ...currentSegment.bridgeStandards]
    }, [])
    const uniqueStandards = [...new Set(bridgeStandardArray)]
    return uniqueStandards
}

const step4_combineStandards = (currentStandards, projectStandards, bridgeStandards) => {
    return [...currentStandards, ...projectStandards, ...bridgeStandards]
}

const step5_filterAndEnrichWithBridges = async (segments, allStandards, student, depth) => {
    let filteredSegments = []
    for (const segment of segments) {
        if (segment.bridgeStandards.length) {
            const bridges = await step5a_addBridgesToSegments(segment.bridgeStandards, allStandards, student, depth)
            if (Object.keys(bridges).length && Object.values(bridges).every( arrayOfBridges => arrayOfBridges.length )) {
                const newSegment = Object.assign({}, segment, { bridges: bridges })
                filteredSegments = [...filteredSegments, newSegment]
            }
        } else {
            filteredSegments = [...filteredSegments, Object.assign({}, segment)]
        }
    }
    return filteredSegments
}

const step5a_addBridgesToSegments = async (bridgeStandards, allStandards, student, depth) => {
    const bridges = {}
    for (const bridgeStandard of bridgeStandards) {
        bridges[bridgeStandard] = await query(queries.findBridgeSegments(allStandards, bridgeStandard, student, depth))
    }
    return bridges
}

const step6_combineFilteredSegments = (filteredGoalSegments, filteredStartSegments) => {
    return [...filteredGoalSegments, ...filteredStartSegments]
}

const step7_getFinalDestinations = filteredGoalSegments => {
        const edges = filteredGoalSegments.map( segment => [segment._from, segment._to] )
        const sequence = toposort(edges, { continueOnCircularDependency: true })
        return [ sequence[sequence.length -1] ]
}

const step8_findProjectPaths = async (currentStandards, finalDestinations, collection) => {
    const paths = await query(queries.findShortestPaths(currentStandards, finalDestinations, collection))
    if (paths.length) {
        const minLength = paths.reduce( (minLength, path) => {
            const pathLength = path.reduce( (sum, segment) => sum + segment.length, 0 )
            return Math.min(minLength, pathLength)
        }, Infinity)
        return paths.filter( path => {
            const pathLength = path.reduce( (sum, segment) => sum + segment.length, 0 )
            return pathLength === minLength
        })
    } else {
        return []
    }
}

const step9_openUpPathSegments = paths => {
    let uniqueEdgeIds = new Set()
    const allEdges = paths.reduce( (allEdges, path) => {
        const pathEdges = path.reduce( (pathEdges, segment) => {
            const segmentEdges = segment.underlyingPath.reduce( (segmentEdges, edge) => {
                if (!uniqueEdgeIds.has(edge._id)) {
                    uniqueEdgeIds.add(edge._id)
                    segmentEdges.push(edge)
                }
                return segmentEdges
            }, [] )
            return [...pathEdges, ...segmentEdges]
        }, [] )
        return [...allEdges, ...pathEdges]
    }, [] )
    return allEdges
}

const step1013_sequencePathStandards = pathEdges => {
    return toposort(pathEdges.map( e => [e._from, e._to] ), {continueOnCircularDependency: true})
}

const step11_openUpBridgeSegments = (pathStandards, currentStandards, paths) => {
    let uniqueEdgeIds = new Set()
    const allBridgeEdges = paths.reduce( (allBridgeEdges, path) => {
        const pathBridgeEdges = path.reduce( (pathBridgeEdges, segment) => {
            let segmentBridgeEdges = []
            if (segment.hasOwnProperty('bridges')) {
                Object.values(segment.bridges).forEach( bridgeOptions => {
                    const bestbridge = step11a_pickShortestBridge(bridgeOptions, [...pathStandards, ...currentStandards])
                    const bridgeEdges = bestbridge.underlyingPath.reduce( (bridgeEdges, edge) => {
                        if (!uniqueEdgeIds.has(edge._id)) {
                            uniqueEdgeIds.add(edge._id)
                            bridgeEdges.push(edge)
                        }
                        return bridgeEdges
                    }, [])
                    segmentBridgeEdges = [...segmentBridgeEdges, ...bridgeEdges]
                } )
            }
            return [...pathBridgeEdges, ...segmentBridgeEdges]
        }, [] )
        return [...allBridgeEdges, ...pathBridgeEdges]
    }, [] )
    return allBridgeEdges
}

const step11a_pickShortestBridge = (bridgeOptions, potentialStandards) => {
    for (const bridge of bridgeOptions) {
        if (potentialStandards.includes(bridge._from)) {
            return bridge
        }
    }
}

const step12_combineEdges = (pathEdges, bridgeEdges) => {
    let uniqueEdgeIds = new Set(pathEdges.map( e => e._id ))
    let combinedEdges = [...pathEdges]
    for (let bridgeEdge of bridgeEdges) {
        if (!uniqueEdgeIds.has(bridgeEdge._id)) {
            uniqueEdgeIds.add(bridgeEdge._id)
            combinedEdges = [...combinedEdges, bridgeEdge]
        }
    }
    return combinedEdges
}

const step14_getAlignedFocusAreas = async (standardsInSequence, student) => {
    const focusAreas = await query(queries.getAlignedFocusAreas(standardsInSequence, student))
    return focusAreas
}

const step15_sortFocusAreas = focusAreaEdges => {
    return focusAreaEdges.map( standard => { 
        return {
            standard: standard.standard,
            focusAreaSequence: toposort(standard.focusAreaEdges, {continueOnCircularDependency: true})
        }
     } )
}

const step16_connectFocusAreas = sortedFocusAreas => {
    return sortedFocusAreas.reduce( (sequence, currentSet) => {
        return [...sequence, ...currentSet.focusAreaSequence]
    }, [] )
}

const step17_addFocusAreaNames = async sequencedFocusAreas => {
    let newFocusAreaArray = []
    for (let focusArea of sequencedFocusAreas) {
        const focusAreaWithName = await query(queries.getDocumentNames(focusArea))
        newFocusAreaArray = [...newFocusAreaArray, focusAreaWithName.pop()]
    }
    return newFocusAreaArray
}

const step18_prepareProjectObject = (project, focusAreas) => {
    return {
        name: project.topic,
        fa: focusAreas
    }
}

const groupStudentsByProjects = async students => {
    const groupedStudentProjects = await query(queries.groupStudentsByProjects(students))
    return groupedStudentProjects
}


const getPaths = async queryObject => {
    console.log(JSON.stringify(queryObject, null, 4))
    const userId = 'auth_users/' + queryObject.userKey,
        queryGrades = queryObject.grades ? queryObject.grades.map( grade => parseInt(grade, 10) ) : [],
        queryCourses = queryObject.courses ? queryObject.courses.map( courseKey => 'courses/' + courseKey) : [],
        queryTopics = queryObject.topics ? queryObject.topics.map( topic => topic.toLowerCase() ) : [],
        querySubjects = queryObject.subjects ? queryObject.subjects.map( subject => subject.toUpperCase() ) : [],
        queryStandards = queryObject.standards? queryObject.standards.map( standard => standard.toUpperCase() ) : [];

    const students = await query(queries.getStudents(queryCourses, userId, queryGrades))
    log(students)

    const projects = await query(queries.getProjects(queryTopics))
    for (let student of students) {
        student.projects = []
        for ( const project of projects ) {
            const projectObject = await getPath(student, project)
            student.projects = [...student.projects, projectObject]
        }
    }
    const projectResponse = await groupStudentsByProjects(students)
    return projectResponse
}

const getPath = async (student, project) => {
    const projectMinutes = project.avgMinutes || 360
    const studentMinutes = student.avgMinutes || 45
    const maxSequenceDepth = Math.floor(projectMinutes / studentMinutes)

    const goalSegments = await step1_findGoalSegments(project.standards, student, maxSequenceDepth)
    const startSegments = await step2_findStartSegments(student.current, project.standards, student, maxSequenceDepth)
    const bridgeStandards = step3_getFullListOfBridgeStandards(goalSegments, startSegments)
    const allStandards = step4_combineStandards(student.current, project.standards, bridgeStandards)
    const filteredGoalSegments = await step5_filterAndEnrichWithBridges(goalSegments, allStandards, student, maxSequenceDepth)
    const filteredStartSegments = await step5_filterAndEnrichWithBridges(startSegments, allStandards, student, maxSequenceDepth)
    const filteredCombinedSegments = step6_combineFilteredSegments(filteredGoalSegments, filteredStartSegments)
    const finalDestinations = step7_getFinalDestinations(filteredGoalSegments)
    const collectionName = `s${student._key}p${project.topic.replace(/ /g, '')}`
    const result = await arango.storeInCollection(filteredCombinedSegments, collectionName, true)
    try {
        const collection = await arango.getCollection(collectionName, true)
        const shortestPaths = await step8_findProjectPaths(student.current, finalDestinations, collection)
        const pathEdges = step9_openUpPathSegments(shortestPaths)
        const sequencedPathStandards = step1013_sequencePathStandards(pathEdges)
        const bridgeEdges = step11_openUpBridgeSegments(sequencedPathStandards, student.current, shortestPaths)
        const allEdges = step12_combineEdges(pathEdges, bridgeEdges)
        const standardsPathSequence = step1013_sequencePathStandards(allEdges)
        const alignedFocusAreas = await step14_getAlignedFocusAreas(standardsPathSequence, student)
        const sortedFocusAreas = step15_sortFocusAreas(alignedFocusAreas)
        const sequencedFocusAreas = step16_connectFocusAreas(sortedFocusAreas)
        const namedFocusAreas = await step17_addFocusAreaNames(sequencedFocusAreas)
        const projectObject = step18_prepareProjectObject(project, namedFocusAreas)
        student.planned = [...student.planned, ...standardsPathSequence]
        return projectObject
    } finally {
        await arango.cleanUpCollection(collectionName, true)
    }
}

const log = logObject => {
    console.log(JSON.stringify(logObject, null, 4))
}

module.exports = getPaths

// getPaths(testData.queryObject)