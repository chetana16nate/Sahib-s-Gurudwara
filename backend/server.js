import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({
  path: fileURLToPath(new URL('.env', import.meta.url))
});
import app from './app.js';
import { connectDatabase } from './src/config/db.js';

const port = Number(process.env.PORT || 5000);

connectDatabase()
  .then(() =>
    app.listen(port, () =>
      console.log(`API listening on http://localhost:${port}`)
    )
  )
  .catch((error) => {
    console.error('Unable to start API:', error.message);
    process.exit(1);
  });
