export default function SustainabilityScore() {
  const score = 82;

  return (
    <div className="sustainability-score">
      <h3>Sustainability Score 🌍</h3>

      <p className="score">{score} / 100</p>

      <div>
        <span className="badge eco">Eco Seller 🌿</span>
        <span className="badge champion">Zero-Waste Champion 🏆</span>
      </div>
    </div>
  );
}
