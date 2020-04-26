declare namespace NodeJS {
  interface Process {
    env: ProcessEnv;
  }
  interface ProcessEnv {
    NODE_ENV: string;
    connectionString: string;
    jwtSecret: string;
    jwtExpiresIn: string;
  }
}
