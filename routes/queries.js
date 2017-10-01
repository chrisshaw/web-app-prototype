const aql = require('arangojs').aql

module.exports = {
    getTeachersAndAdmins: aql`
        for v, e, path
        in 3 any ${adminUserId}
        atSchool, auth_hasRole
        filter IS_SAME_COLLECTION('auth_users', path.vertices[2])
        filter IS_SAME_COLLECTION('auth_hasRole', path.edges[2])
        filter PARSE_IDENTIFIER(v._id).key in ['teacher', 'admin']
        collect user = KEEP(path.vertices[2], 'first', 'last', 'username', '_id', '_key') into role = { role: v._id, hasRoleId: path.edges[2]._id }
        let firstRole = FIRST(UNIQUE(role))
        return MERGE(user, { "role": firstRole.role, "roleConnectionId": firstRole.hasRoleId } )
    `,
    getAllInterests: aql`
        for col in [auth_users, courses]
            for doc in col
            filter HAS(doc, 'interests')
                for interest in FLATTEN(VALUES(doc.interests))
                sort interest
                return distinct interest
    `,
    updateUserRole: aql`
        // newRoleKey must be either 'teacher' or 'admin'    
        for vertex, roleEdge
        in outbound ${userId}
        auth_hasRole
        update roleEdge with { 
            _to: CONCAT("auth_roles/", LOWER(${newRoleKey})),
            lastUpdated: DATE_NOW(),
            updatedBy: ${currentUserId}
        } in auth_hasRole
        return { updated: NEW._from, newRole: NEW._to }
    `
}