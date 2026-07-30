import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto w-full py-xl px-margin-desktop bg-primary text-on-primary flex flex-col md:flex-row justify-between items-center gap-md">
      <div className="flex flex-col gap-xs items-center md:items-start text-center md:text-left">
        <h2 className="font-headline-md text-headline-md font-bold text-on-primary">iTEP Center</h2>
        <p className="font-body-sm text-on-primary/60 max-w-[24rem]">
          © 2026 iTEP International. Academic Excellence Defined. Global centers in over 50 countries.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-lg">
        <Link className="font-body-sm text-on-primary/80 hover:text-on-primary transition-colors" href="/free-tests">
          Free Tests
        </Link>
        <Link className="font-body-sm text-on-primary/80 hover:text-on-primary transition-colors" href="/partner-schools">
          Partner Schools
        </Link>
        <Link className="font-body-sm text-on-primary/80 hover:text-on-primary transition-colors" href="/existing-clients">
          Existing Clients
        </Link>
        <a className="font-body-sm text-on-primary/80 hover:text-on-primary transition-colors" href="#">
          Privacy Policy
        </a>
        <a className="font-body-sm text-on-primary/80 hover:text-on-primary transition-colors" href="#">
          Terms of Service
        </a>
      </div>
    </footer>
  );
}
