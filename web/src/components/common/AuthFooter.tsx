import Link from 'next/link';

interface AuthFooterProps {
  label: string;
  linkText: string;
  href: string;
}

export function AuthFooter({ label, linkText, href }: AuthFooterProps) {
  return (
    <div className="text-center text-sm text-muted-foreground mt-6">
      {label}{' '}
      <Link
        href={href}
        className="text-primary hover:text-foreground transition-colors underline-offset-4 hover:underline font-medium"
      >
        {linkText}
      </Link>
    </div>
  );
}
