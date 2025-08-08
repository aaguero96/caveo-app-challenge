import { createApp } from './app';

const main = async () => {
  const app = await createApp();

  app.listen(process.env['POST'] || 3000);
};

main();
