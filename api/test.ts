export default (req: any, res: any) => {
  res.json({
    working: true,
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      CWD: process.cwd()
    }
  });
};
