import PageHeader from "../components/PageHeader";

interface RegistryLinkProps {
  store: string;
  icon: string;
  url: string;
}

function RegistryLink({ store, icon, url }: RegistryLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-cream rounded-xl p-5 sm:p-6 md:p-8 border border-pink/30 hover:border-plum/30 transition-all hover:shadow-md text-center min-h-[44px]"
    >
      <span className="text-3xl sm:text-4xl block mb-3 sm:mb-4">{icon}</span>
      <h3 className="font-display text-plum text-lg sm:text-xl tracking-[1.68px] italic group-hover:text-burgundy transition-colors">
        {store}
      </h3>
      <p className="font-body text-plum/50 text-xs sm:text-sm mt-2 tracking-wide">
        View Registry →
      </p>
    </a>
  );
}

export default function Registry() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
      <PageHeader title="Registry" />

      <p className="text-center font-body text-plum/75 text-base sm:text-lg leading-7 max-w-xl mx-auto mb-8 sm:mb-10 px-1">
        Your presence at our wedding is the greatest gift of all. However, if
        you wish to honor us with a gift, we've registered at the following
        stores.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <RegistryLink store="Crate & Barrel" icon="🏠" url="https://example.com" />
        <RegistryLink store="Williams Sonoma" icon="🍳" url="https://example.com" />
        <RegistryLink store="Amazon" icon="📦" url="https://example.com" />
        <RegistryLink store="Honeymoon Fund" icon="✈️" url="https://example.com" />
      </div>

      <div className="text-center mt-8 sm:mt-12 p-5 sm:p-6 md:p-8 bg-pink/20 rounded-xl">
        <p className="font-display text-plum text-base sm:text-lg tracking-[1.68px] italic mb-2">
          A Note About Gifts
        </p>
        <p className="font-body text-plum/70 text-sm sm:text-base leading-7 max-w-md mx-auto text-left sm:text-center">
          If you'd prefer to give a monetary gift, we'd greatly appreciate
          contributions to our honeymoon fund. Every bit helps us create
          unforgettable memories on our first adventure as a married couple!
        </p>
      </div>
    </div>
  );
}
