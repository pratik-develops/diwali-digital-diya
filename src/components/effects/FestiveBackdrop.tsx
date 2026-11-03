export function FestiveBackdrop() {
  const stars = Array.from({ length: 48 }, (_, index) => ({
    left: `${(index * 17) % 100}%`,
    top: `${(index * 29) % 92}%`,
    size: 2 + (index % 4),
    delay: `${(index % 9) * 0.35}s`,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {stars.map((star, index) => (
        <span
          key={index}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
          }}
        />
      ))}
      <div className="absolute -left-10 top-16 h-40 w-40 rounded-full bg-saffron/20 blur-3xl" />
      <div className="absolute right-0 top-24 h-52 w-52 rounded-full bg-pink/20 blur-3xl" />
      <div className="absolute bottom-10 left-1/3 h-48 w-48 rounded-full bg-peacock/20 blur-3xl" />
    </div>
  );
}
