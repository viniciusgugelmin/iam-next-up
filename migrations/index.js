"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var fs_1 = require("fs");
var MIGRATION_DIR = "./migrations";
var getTimestamp = function () { return new Date().toISOString().replace(/:/g, "-"); };
var getMigrationFileName = function (name) { return "".concat(getTimestamp(), "-").concat(name, ".js"); };
var getMigrationFilePath = function (name) {
    return "".concat(MIGRATION_DIR, "/").concat(getMigrationFileName(name));
};
var createMigrationFile = function (args) {
    var name = args[1];
    var filePath = getMigrationFilePath(name);
    if ((0, fs_1.existsSync)(filePath)) {
        console.log("Migration file ".concat(filePath, " already exists"));
        process.exit(0);
    }
    var content = "\n    const ".concat(name, "Migration = async () => {}\n    ").concat(name, "Migration();\n  ");
    (0, fs_1.writeFileSync)(filePath, content);
    console.log("Migration file ".concat(filePath, " created"));
};
var runMigrations = function () { return __awaiter(void 0, void 0, void 0, function () {
    var historyFile, history, files, migrations, _i, migrations_1, migration, migrationFile, migrationFunction, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                historyFile = (0, fs_1.readFileSync)("".concat(MIGRATION_DIR, "/history.json"));
                history = JSON.parse(historyFile.toString());
                files = (0, fs_1.readdirSync)(MIGRATION_DIR);
                migrations = files.filter(function (file) {
                    return file.endsWith(".js") && file !== "index.js" && !history.includes(file);
                });
                if (migrations.length === 0) {
                    console.log("No new migrations");
                    process.exit(0);
                }
                _i = 0, migrations_1 = migrations;
                _a.label = 1;
            case 1:
                if (!(_i < migrations_1.length)) return [3 /*break*/, 7];
                migration = migrations_1[_i];
                console.log("Running migration ".concat(migration));
                migrationFile = (0, fs_1.readFileSync)("".concat(MIGRATION_DIR, "/").concat(migration));
                migrationFunction = new Function(migrationFile.toString());
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, migrationFunction()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.log("Error running migration ".concat(migration));
                console.log(error_1);
                process.exit(0);
                return [3 /*break*/, 5];
            case 5:
                history.push(migration);
                (0, fs_1.writeFileSync)("".concat(MIGRATION_DIR, "/history.json"), JSON.stringify(__spreadArray([], history, true)));
                console.log("Migration ".concat(migration, " done"));
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 1];
            case 7: return [2 /*return*/];
        }
    });
}); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var args;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                args = process.argv.slice(2);
                if (args[0] === "--help" || args[0] === "-h") {
                    console.log("\n      Usage:\n        node migrations/index.js create <migrationName>\n        node migrations/index.js migrate\n    ");
                    process.exit(0);
                }
                if (!(args[0] === "migrate")) return [3 /*break*/, 2];
                return [4 /*yield*/, runMigrations()];
            case 1:
                _a.sent();
                process.exit(0);
                _a.label = 2;
            case 2:
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
                return [2 /*return*/];
        }
    });
}); };
main();
