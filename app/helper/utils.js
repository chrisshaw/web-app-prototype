import equal from 'deep-equal'

export const checkObjectEquality = (object1, object2) => {
    const isEqual = equal(object1, object2)
    return isEqual
}