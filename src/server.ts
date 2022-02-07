import { connectDB } from "./mongo";
import app from "./app";

const port = process.env.PORT || 80;

const run = async () => {
  await connectDB();

  await app.listen(port, () => {
    console.log(`Example app listening at port ${port}`);
  });
};

run();
