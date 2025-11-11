export default function InfluenceChart() {
  const influences = [
    { name: "Ano", value: 29.67, color: "bg-blue-500" },
    { name: "Média Móvel 3m", value: 16.14, color: "bg-emerald-500" },
    { name: "Taxa Cresc. 3m", value: 14.23, color: "bg-purple-500" },
    { name: "Desvio Padrão 6m", value: 12.79, color: "bg-orange-500" },
    { name: "Taxa Cresc. 1m", value: 6.0, color: "bg-pink-500" },
  ];

  // Mapeia as classes do Tailwind para cores hexadecimais reais
  const getColor = (colorClass) => {
    const map = {
      "bg-blue-500": "#3B82F6",
      "bg-emerald-500": "#10B981",
      "bg-purple-500": "#8B5CF6",
      "bg-orange-500": "#F97316",
      "bg-pink-500": "#EC4899",
    };
    return map[colorClass] || "#000";
  };

  const total = influences.reduce((acc, item) => acc + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Fatores Mais Influentes
      </h3>

      <div className="flex items-center gap-6">
        {/* Gráfico circular */}
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 200 200" className="transform -rotate-90">
            {influences.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const largeArcFlag = angle > 180 ? 1 : 0;

              const startX = 100 + 80 * Math.cos((currentAngle * Math.PI) / 180);
              const startY = 100 + 80 * Math.sin((currentAngle * Math.PI) / 180);
              const endX =
                100 + 80 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
              const endY =
                100 + 80 * Math.sin(((currentAngle + angle) * Math.PI) / 180);

              const path = `M 100 100 L ${startX} ${startY} A 80 80 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
              currentAngle += angle;

              return (
                <path
                  key={index}
                  d={path}
                  fill={getColor(item.color)}
                  opacity="0.9"
                />
              );
            })}
            {/* Círculo central branco */}
            <circle cx="100" cy="100" r="45" fill="white" />
          </svg>

          {/* Texto central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="flex-1 space-y-2">
          {influences.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded ${item.color}`}
                ></div>
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {item.value.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
