"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { images, site } from "@/data/site";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={images.hero}
          alt="Professional event staff working a live concert production"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/25" />
      </div>

      <div className="container-page relative flex min-h-[86vh] items-center py-20">
        <div className="max-w-2xl text-white">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 text-xs font-semibold tracking-[0.22em] text-brand-gold uppercase"
          >
            Events & Communications
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="font-heading text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            {site.tagline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="mt-6 max-w-xl text-base leading-7 text-white/80 md:text-lg"
          >
            {site.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
          >
            <Link
              href="/jobs"
              className={cn(
                buttonVariants({ size: "xl" }),
                "w-full bg-brand-coral text-white hover:bg-brand-coral/90 sm:w-auto"
              )}
            >
              Browse Open Jobs
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "xl", variant: "outline" }),
                "w-full border-white/30 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
              )}
            >
              Get in touch
            </Link>
          </motion.div>
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="absolute right-5 bottom-8 hidden max-w-xs rounded-2xl border border-white/15 bg-white/10 p-4 text-white shadow-lg backdrop-blur-md md:right-8 md:block"
        >
          <p className="text-xs font-semibold tracking-[0.16em] text-brand-gold uppercase">
            Permanent & freelance
          </p>
          <p className="mt-2 font-heading text-lg font-bold">
            The right connections
          </p>
          <p className="mt-1 text-sm text-white/70">
            People, relationships and industry expertise
          </p>
        </motion.aside>
      </div>
    </section>
  );
}
