// A simple badge component to display the rating of a swim session
export default function RatingBadge({ value }) {
  const cls = value >= 8 ? 'rating-high' : value >= 5 ? 'rating-mid' : 'rating-low'
  return <span className={`rating-badge ${cls}`}>{value}</span>
}