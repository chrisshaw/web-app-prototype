module.exports = [
    {
        studentsOnPath: [
            {
                _id: 'users/student1',
                name: 'John Doe',
                masteredFocusAreas: [
                    {
                        _id: 'focusAreas/1',
                        lastUpdated: new Date()
                    }
                ]
            },
            {
                _id: 'users/student2',
                name: 'Jane Doe',
                masteredFocusAreas: [
                    {
                        _id: 'focusAreas/2',
                        lastUpdated: new Date()
                    }
                ]                
            }
        ],
        projectsOnPath: [
            {
                name: 'Lions, tigers, and bears, oh my!',
                fa: [
                    {
                        _id: 'focusAreas/f5',
                        relevance: 'Highly Relevant'
                    },
                    {
                        _id: 'focusAreas/f1',
                        relevance: 'Highly Relevant'
                    },
                    {
                        _id: 'focusAreas/f4',
                        relevance: 'Supporting Concept'
                    },
                    {
                        _id: 'focusAreas/f3',
                        relevance: 'Relevant'
                    },
                    {
                        _id: 'focusAreas/f2',
                        relevance: 'Relevant'
                    }
                ]
            }
        ]
    }
]