"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Locale } from "@/lib/i18n";

interface DirectAuthLinksProps {
  locale?: string | Locale;
  loginText?: string;
  registerText?: string;
}

/**
 * A simpler version of auth links that directly links to login/register pages
 * without any authentication state checking
 */
export default function DirectAuthLinks({
  locale,
  loginText = "Log In",
  registerText = "Register"
}: DirectAuthLinksProps) {
  // Ensure locale is a string and handle undefined case
  const localeString = !locale ? 'en-GB' : (typeof locale === 'string' ? locale : locale.toString());

  return (
    <div className="flex flex-col space-y-2">
      <Button
        asChild
        variant="outline"
        className="border border-white/20 bg-white/10 hover:bg-white/20 text-white"
      >
        <Link href={`/${localeString}/auth/login`} prefetch={false}>
          {loginText}
        </Link>
      </Button>
      <Button
        asChild
        className="bg-white text-[#238287] hover:bg-white/90"
      >
        <Link href={`/${localeString}/auth/register`} prefetch={false}>
          {registerText}
        </Link>
      </Button>
    </div>
  );
}
