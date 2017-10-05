const aql = require('arangojs').aql

module.exports = {
    findShortSegments: (startStandards, endStandards, student, depth) => aql`
        for start in ${startStandards}
            for end in ${endStandards}
            filter end != start
            let segment = (
                for v, e
                in outbound shortest_path
                start to end
                thenMaster, relatesTo
                filter e != null
                let isReview = v._id in ${student.mastered}
                return {
                    connectionType: PARSE_IDENTIFIER(e._id).collection,
                    _id: e._id,
                    _from: e._from,
                    _to: e._to,
                    'isReview': isReview,
                    weight: SUM([
                        1,
                        TO_NUMBER(isReview),
                        TO_NUMBER(v._id in ${student.planned})
                    ])
                }
            )
            let bridgeStandards = (
                for connection in segment
                filter connection.connectionType == 'relatesTo'
                    for s in [connection._from, connection._to]
                    filter s not in UNION_DISTINCT(${startStandards}, ${endStandards})
                    return distinct s
            )
            let segmentLength = LENGTH(segment)
            filter segmentLength > 0 && segmentLength <= ${depth}
            return {
                _from: start,
                _to: end,
                underlyingPath: segment,
                length: segmentLength,
                weight: SUM(segment[*].weight),
                'bridgeStandards': bridgeStandards
            }
    `,
    findBridgeSegments: (allStandards, bridgeStandard, student, depth) => aql`
        for start in ${allStandards}
        filter start != ${bridgeStandard}
        let bridge = (
            for v, e
            in outbound shortest_path
            start to ${bridgeStandard}
            thenMaster
            filter e != null
            let isReview = v._id in ${student.mastered}
            return {
                connectionType: 'bridgeSupport',
                _id: e._id,
                _from: e._from,
                _to: e._to,
                'isReview': isReview,
                weight: SUM([
                    0,
                    TO_NUMBER(isReview),
                    TO_NUMBER(v._id in ${student.planned})
                ])
            }
        )
        let bridgeLength = LENGTH(bridge)
        filter bridgeLength > 0 && bridgeLength <= ${depth}
        let returnSegment = {
            _from: start,
            _to: ${bridgeStandard},
            underlyingPath: bridge,
            length: bridgeLength,
            weight: SUM(bridge[*].weight)
        }
        sort returnSegment.length
        return returnSegment
    `,
    findShortestPaths: (currentStandards, finalStandards, collection) => aql`
        for start in ${currentStandards}
            for end in ${finalStandards}
            let path = (
                for v, e
                in outbound shortest_path
                start to end                    
                ${collection}
                options { weightAttribute: 'weight' }
                filter e != null
                return e
            )
            filter LENGTH(path) > 0
            return path
    `,
    getAlignedFocusAreas: (standardsInSequence, student) => aql`
        for s in ${standardsInSequence}
        let stageSet = (
            for v, e, p
            in 2 inbound s
            alignsTo, focusesOn
            filter IS_SAME_COLLECTION('focusAreas', p.vertices[1])
            filter IS_SAME_COLLECTION('courses', p.vertices[2])
                and p.vertices[2]._id in ${student.taking}
            return distinct p.vertices[1]._id
        )
        let edgesForSorting = (
            for start in stageSet
                for end in stageSet
                // filter start != end
                let connection = (
                    for v, e
                    in outbound shortest_path
                    start to end
                    thenFocusOn
                    return 1
                )
                filter connection != null
                return [start, end]
        )
        return { standard: s, focusAreaEdges: edgesForSorting }
    `,
    getDocumentNames: id => aql`
        return KEEP(DOCUMENT(focusAreas, ${id}), '_id', 'name')
    `,
    getStudents: (queryCourses, userId, queryGrades) => aql`
        let querySections = (
            for course in ${queryCourses}
                for v
                in inbound course
                hasCourse
                filter IS_SAME_COLLECTION('sections', v)
                return distinct v._id
        )
        for v, e, p
        in 3 any ${userId}
        hasSection, outbound auth_hasRole
        filter LENGTH(querySections) == 0 || p.vertices[1]._id in querySections
        filter IS_SAME_COLLECTION('auth_users', p.edges[1]._from)
        filter LENGTH(${queryGrades}) == 0 || TO_NUMBER(p.vertices[2].grade) in ${queryGrades}
        filter IS_SAME_COLLECTION('auth_roles', p.edges[2]._to)
            and UPPER(PARSE_IDENTIFIER(p.edges[2]._to).key) == 'STUDENT'
        collect student = KEEP(p.vertices[2], '_id', '_key', 'first', 'last', 'grade', 'avgMinutes') into inSections = p.vertices[1]._id
        let studentId = student._id
        return {
            '_id': studentId,
            '_key': student._key,
            'first': student.first,
            'last': student.last,
            'grade': student.grade,
            'avgMinutes': student.avgMinutes,
            'taking': (
                for section in inSections
                    for v
                    in outbound section
                    hasCourse
                    filter v != null
                    return distinct v._id
            ),
            'mastered': (
                for v
                in outbound studentId
                hasMastered
                return v._id
            ),
            'current': FIRST(
                let current = (
                    for v
                    in outbound studentId
                    currentFocus
                    collect type = PARSE_IDENTIFIER(v._id).collection into items = v._id
                    return { 'type': type, [type]: items }
                )
                let hasStandards = LENGTH(current) > 1
                return hasStandards ? (
                    filter hasStandards
                    for c in current
                    filter c.type == 'standards'
                        for s in c.standards
                        return distinct s
                ) : FIRST(
                    filter !hasStandards
                    let hasNothing = LENGTH(current) == 0
                    return hasNothing ? (
                        filter hasNothing
                        for section in inSections
                            for s
                            in 2 outbound section
                            hasCourse, startsAt
                            filter IS_SAME_COLLECTION('standards', s)
                            return distinct s._id
                    ) : (
                        filter !hasNothing
                        for f in FIRST(current).focusAreas
                            for s
                            in outbound f
                            alignsTo
                            return distinct s._id
                    )
                )
            ),
            'planned': (
                for path
                in outbound studentId
                onPath
                return path
            )
        }
    `,
    getProjects: queryTopics => aql`
        for topic in ${queryTopics}
            let relevantProjects = (
                for project in projects
                filter topic in project.topics
                return MERGE(
                    KEEP(project, '_id', '_key', 'minutes', 'name', 'details', 'link'),
                    { 
                        standards: (
                            for v
                            in outbound project
                            alignsTo
                            filter v != null
                            return distinct v._id
                        )
                    }
                )
            )
            return {
                'topic': topic,
                projects: relevantProjects,
                avgMinutes: AVERAGE(
                    for p in relevantProjects
                    return TO_NUMBER(p.minutes)
                ),
                standards: UNIQUE(FLATTEN(relevantProjects[*].standards))
            }
    `,
    groupStudentsByProjects: students => aql`
        for student in ${students}
        collect projectPath = student.projects
            into studentsOnPath = CONCAT(student.first, " ", student.last)
        return { 'projectPath': projectPath, 'studentsOnPath': studentsOnPath }
    `
}