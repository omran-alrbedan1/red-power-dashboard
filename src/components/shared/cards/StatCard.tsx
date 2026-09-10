interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  sub: string      
  change?: number  
}
const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sub,
  icon,
}) => {
  return (
    <div className="group relative min-h-40 w-full overflow-hidden rounded-xl border border-border/80 bg-background-card/90 shadow-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_20px_45px_rgba(0,0,0,0.32)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-70" />
      <div
        className={"absolute inset-0 flex flex-col justify-between p-6 transition-all duration-200 group-hover:scale-[1.01]"}
      >
        {/* Top Section */}
        <div className="flex flex-col gap-1">
          <h3 className="text-[18px] font-bold text-primary tracking-[-0.3px] leading-tight m-0">
            {label}
          </h3>
          {sub && (
            <p className="text-[12px] font-medium text-subtitle m-0">
              {sub}
            </p>
          )}
        </div>

        <div className="flex items-end justify-between w-full">
          <p className="text-3xl font-bold tracking-[-0.5px] leading-none m-0">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
      </div>

      {/* Icon positioned correctly for RTL/LTR */}
      <div className="absolute bottom-0 ltr:right-0 rtl:left-0 w-16 h-16 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-primary-light/30 bg-primary text-white shadow-[0_8px_24px_rgba(225,6,19,0.28)] transition-transform group-hover:scale-105 ltr:translate-x-1 ltr:translate-y-1 rtl:-translate-x-1 rtl:translate-y-1">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
