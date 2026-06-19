import { signupSchema } from '../../shared/schemas/auth.schemas.js';

const testData = {
  name: "SUKESH D",
  email: "sukesh.d.31012006@gmail.com",
  username: "sukeshofficial",
  password: process.env.TEST_PASSWORD || "Dummy@12345"
};

try {
  console.log('Testing signupSchema with valid data...');
  const validatedBody = signupSchema.shape.body.parse(testData);
  console.log('Success! Validated body:', validatedBody);

  const fullValidation = signupSchema.parse({ body: testData, query: {}, params: {} });
  console.log('Success! Full validation:', fullValidation);
} catch (error) {
  console.error('Validation failed:', error.errors);
  process.exit(1);
}
