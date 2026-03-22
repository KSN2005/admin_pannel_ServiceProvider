const DashboardCard = ({ title, value, className = "" }) => {
  return (
    <div className={`p-6 rounded-xl shadow ${className}`}>
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default DashboardCard;
