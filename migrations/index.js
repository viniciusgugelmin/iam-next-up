import fs from "fs";
import dayjs from "dayjs";

const MIGRATION_DIR = "./migrations";

const getTimestamp = () => dayjs().format("YYYYMMDDHHmmss");

const getMigrationFileName = (name) => `${getTimestamp()}-${name}.js`;

const getMigrationFilePath = (name) =>
  `${MIGRATION_DIR}/${getMigrationFileName(name)}`;

const createMigrationFile = (args) => {
  const [, name] = args;
  const filePath = getMigrationFilePath(name);

  if (fs.existsSync(filePath)) {
    console.log(`Migration file ${filePath} already exists`);
    process.exit(0);
  }

  const content = `
    const ${name}Migration = async () => {}
    await ${name}Migration();
  `;

  fs.writeFileSync(filePath, content);
  console.log(`Migration file ${filePath} created`);
};

const runMigrations = async () => {
  const historyFile = fs.readFileSync(`${MIGRATION_DIR}/history.json`);
  const history = JSON.parse(historyFile);
  const files = fs.readdirSync(MIGRATION_DIR);
  const migrations = files.filter(
    (file) =>
      file.endsWith(".js") && file !== "index.js" && !history.includes(file)
  );

  if (migrations.length === 0) {
    console.log("No new migrations");
    process.exit(0);
  }

  for (const migration of migrations) {
    console.log(`Running migration ${migration}`);
    const migrationFile = fs.readFileSync(`${MIGRATION_DIR}/${migration}`);
    const migrationFunction = new Function(migrationFile);
    try {
      await migrationFunction();
    } catch (error) {
      console.log(`Error running migration ${migration}`);
      console.log(error);
      process.exit(0);
    }

    history.push(migration);
    fs.writeFileSync(
      `${MIGRATION_DIR}/history.json`,
      JSON.stringify([...history])
    );
    console.log(`Migration ${migration} done`);
  }
};

const main = async () => {
  const args = process.argv.slice(2);

  if (args[0] === "--help" || args[0] === "-h") {
    console.log(`
      Usage:
        node migrations/index.js create <migrationName>
        node migrations/index.js migrate
    `);
    process.exit(0);
  }

  if (args[0] === "migrate") {
    await runMigrations();
    process.exit(0);
  }

  if (args[0] === "create") {
    if (args.length !== 2) {
      console.log("Invalid number of arguments");
      process.exit(0);
    }

    createMigrationFile(args);
    process.exit(0);
  }

  console.log("Unknown command");
  process.exit(0);
};

await main();
