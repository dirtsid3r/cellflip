import { Smartphone } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Smartphone className="h-4 w-4" />
            </div>
            <span className="cellflip-logo font-bold">cellflip</span>
          </Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Fairtreez
            </a>
            . Kerala's premier mobile resale platform.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © 2024 Fairtreez Technologies. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 