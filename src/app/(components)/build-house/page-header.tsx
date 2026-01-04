import React from 'react';

export function PageHeader() {
  return (
    <main className="w-full bg-gradient-to-b from-primary/5 to-background pt-20 pb-12">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-title md:text-title lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 mb-4">
            Design Your Dream Home
          </h1>
          <p className="text-mid md:text-mid text-muted-foreground max-w-2xl">
            Create your perfect space with our intelligent design tool. Follow the steps below to customize every aspect of your future home.
          </p>
        </div>
      </div>
    </main>
  );
}