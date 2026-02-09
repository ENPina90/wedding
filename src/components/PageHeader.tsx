interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="text-center pt-6 pb-8">
      {/* Decorative flowers row */}
      <div className="flex justify-center gap-2 mb-6 text-2xl">
        <span>🌸</span>
        <span>🌼</span>
        <span>🌺</span>
        <span>🌷</span>
        <span>🌻</span>
      </div>

      <h2 className="font-display text-plum text-3xl md:text-4xl tracking-[2.24px] italic">
        {title}
      </h2>

      {subtitle && (
        <>
          {/* Decorative divider below title */}
          <div className="flex items-center justify-center gap-3 mt-4 max-w-xs mx-auto text-plum/40">
            <div className="flex-1 h-px bg-plum/20" />
            <span className="text-sm">✿</span>
            <div className="flex-1 h-px bg-plum/20" />
          </div>
          <p className="font-body text-plum/70 text-lg mt-3">{subtitle}</p>
        </>
      )}
    </div>
  );
}
