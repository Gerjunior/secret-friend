declare namespace NodeJS {
  interface Process {
    env: ProcessEnv;
  }
  interface ProcessEnv {
    NODE_ENV: string;

    DATABASE_URL: string;
    REDIS_URL: string;

    BASE_DIR: string;
    FILE_EXTENSION: string;

    jwtSecret: string;
    jwtExpiresIn: string;
  }
}
