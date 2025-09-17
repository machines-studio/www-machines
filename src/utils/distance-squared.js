/**
 * Return the distance squared between two points
 * @param {Array[x, y]} a - first point
 * @param {Array[x, y]} b - second point
 */
export default (a, b) => (b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])
