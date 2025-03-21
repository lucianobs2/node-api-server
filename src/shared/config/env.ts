import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, NotEquals, validateSync } from 'class-validator';

class Env {
  @IsString()
  @IsNotEmpty()
  dbURL: string;

  @IsString()
  @IsNotEmpty()
  @NotEquals('unsecure_jwt_secret')
  jwtSecret: string;

  @IsString()
  @IsNotEmpty()
  jwtExpiresIN: string;
}

export const env: Env = plainToInstance(Env, {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIN: process.env.JWT_EXPIRES_IN,
  dbURL: process.env.DATABASE_URL,
});

const errors = validateSync(env);

if (errors.length > 0) {
  console.error(JSON.stringify(errors, null, 2));
}
