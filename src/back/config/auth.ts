export default {
  jwt: {
    secret: process.env.NEXT_PUBLIC_SESSION_SECRET || "default",
    expiresIn: "7d",
  },
};
