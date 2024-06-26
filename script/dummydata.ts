import { deleteAllDevices } from "@/models/device";
import { createUser, deleteAllUsers } from "../models/user";

async function loadDummyData() {
  await deleteAllUsers();
  await deleteAllDevices();

  await createUser({
    email: "admin@lansaver.com",
    password: "admin",
  });
}

loadDummyData().then(() => {
  console.log("Dummy data loaded");
  process.exit(0);
});
