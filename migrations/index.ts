import { existsSync, writeFileSync, readFileSync, readdirSync } from "fs";

const MIGRATION_DIR = "./migrations";

const getTimestamp = () => new Date().toISOString().replace(/:/g, "-");

const getMigrationFileName = (name: string) => `${getTimestamp()}-${name}.js`;

const getMigrationFilePath = (name: string) =>
  `${MIGRATION_DIR}/${getMigrationFileName(name)}`;

const createMigrationFile = (args: string[]) => {
  const [, name] = args;
  const filePath = getMigrationFilePath(name);

  if (existsSync(filePath)) {
    console.log(`Migration file ${filePath} already exists`);
    process.exit(0);
  }

  const content = `
    const ${name}Migration = async () => {}
    ${name}Migration();
  `;

  writeFileSync(filePath, content);
  console.log(`Migration file ${filePath} created`);
};

const runMigrations = async () => {
  const historyFile = readFileSync(`${MIGRATION_DIR}/history.json`);
  const history = JSON.parse(historyFile.toString());
  const files = readdirSync(MIGRATION_DIR);
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
    const migrationFile = readFileSync(`${MIGRATION_DIR}/${migration}`);
    const migrationFunction = new Function(migrationFile.toString());
    try {
      await migrationFunction();
    } catch (error) {
      console.log(`Error running migration ${migration}`);
      console.log(error);
      process.exit(0);
    }

    history.push(migration);
    writeFileSync(
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

main();
