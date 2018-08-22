/**
 * @const {Object} REVIEW_STATS_SCHEMA
 */
const REVIEW_STATS_SCHEMA = {
  count: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  }
}

module.exports = REVIEW_STATS_SCHEMA
