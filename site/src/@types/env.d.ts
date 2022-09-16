declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STRIPE_PUBLIC_KEY: string;
      STRIPE_SECRET_KEY: string;
    }
  }
}

export {}
