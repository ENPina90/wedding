interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="text-center pt-4 sm:pt-6 pb-6 sm:pb-8">
      {/* Decorative flowers row - smaller on mobile */}
      <div className="flex justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 text-xl sm:text-2xl">
        <span>🌸</span>
        <span>🌼</span>
        <span>🌺</span>
        <span>🌷</span>
        <span>🌻</span>
      </div>

      <h2 className="font-display text-plum tracking-[2.24px] italic">
        {title}
      </h2>

      {subtitle && (
        <>
          {/* Decorative divider below title */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4 max-w-xs mx-auto text-plum/40 px-4">
            <div className="flex-1 h-px bg-plum/20" />
            <span className="text-xs sm:text-sm">✿</span>
            <div className="flex-1 h-px bg-plum/20" />
          </div>
          <p className="sub-header font-body text-plum/70 mt-2 sm:mt-3 px-2">{subtitle}</p>
        </>
      )}
    </div>
  );
}
