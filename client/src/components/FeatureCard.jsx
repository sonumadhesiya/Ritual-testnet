function FeatureCard({
  title,
  desc,
  icon,
}) {
  return (
    <div className="feature-card">
      <div className="icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{desc}</p>
    </div>
  );
}

export default FeatureCard;