"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// dist/compile.js
var require_compile = __commonJS({
  "dist/compile.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.compile = void 0;
    var js_12 = require("@axiom-crypto/circuit/js");
    var utils_12 = require("@axiom-crypto/circuit/cliHandler/utils");
    var compile = async (circuitPath, providerUri2) => {
      let circuitFunction = "circuit";
      const f = await (0, utils_12.getFunctionFromTs)(circuitPath, circuitFunction);
      const provider2 = (0, utils_12.getProvider)(providerUri2);
      const circuit2 = new js_12.AxiomBaseCircuit({
        f: f.circuit,
        mock: true,
        provider: provider2,
        shouldTime: false,
        inputSchema: f.inputSchema
      });
      try {
        const res = await circuit2.mockCompile(f.defaultInputs);
        const circuitFn = `const ${f.importName} = AXIOM_CLIENT_IMPORT
${f.circuit.toString()}`;
        const encoder = new TextEncoder();
        const circuitBuild = encoder.encode(circuitFn);
        const build = {
          ...res,
          circuit: Buffer.from(circuitBuild).toString("base64")
        };
        console.log(JSON.stringify(build));
      } catch (e) {
        console.error(e);
      }
    };
    exports2.compile = compile;
  }
});

// dist/utils.js
var require_utils = __commonJS({
  "dist/utils.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getInputs = exports2.getAbi = exports2.findStructDefinition = exports2.findFilesWithAxiomInput = exports2.getSolidityType = void 0;
    var tslib_1 = require("tslib");
    var fs_1 = tslib_1.__importDefault(require("fs"));
    var path_1 = tslib_1.__importDefault(require("path"));
    var viem_1 = require("viem");
    var getSolidityType = (type) => {
      switch (type) {
        case "CircuitValue":
          return "uint256";
        case "CircuitValue256":
          return "uint256";
        case "CircuitValue[]":
          return "uint256[]";
        case "CircuitValue256[]":
          return "uint256[]";
        default:
          throw new Error(`Unknown type ${type}`);
      }
    };
    exports2.getSolidityType = getSolidityType;
    var findFilesWithAxiomInput = (directory) => {
      let file = null;
      function traverseDirectory(dir) {
        const entries = fs_1.default.readdirSync(dir);
        for (const entry of entries) {
          const entryPath = path_1.default.join(dir, entry);
          const stat = fs_1.default.statSync(entryPath);
          if (stat.isDirectory()) {
            traverseDirectory(entryPath);
          } else if (stat.isFile() && entry.endsWith(".json")) {
            const fileContent = fs_1.default.readFileSync(entryPath, "utf8");
            if (fileContent.includes('.AxiomInput"')) {
              file = entryPath;
              return;
            }
          }
        }
      }
      traverseDirectory(directory);
      return file;
    };
    exports2.findFilesWithAxiomInput = findFilesWithAxiomInput;
    var findStructDefinition = (jsonFile) => {
      const jsonData = require(jsonFile);
      const fileName = path_1.default.basename(jsonFile, path_1.default.extname(jsonFile));
      function traverseObject(obj) {
        if (obj.nodeType === "StructDefinition" && obj.canonicalName === `${fileName}.AxiomInput`) {
          return obj;
        }
        for (const key in obj) {
          if (typeof obj[key] === "object") {
            const result = traverseObject(obj[key]);
            if (result !== null) {
              return result;
            }
          }
        }
        return null;
      }
      return traverseObject(jsonData);
    };
    exports2.findStructDefinition = findStructDefinition;
    var getAbi = () => {
      const jsonFile = (0, exports2.findFilesWithAxiomInput)(process.cwd());
      if (jsonFile === null) {
        throw new Error("Could not find json file with AxiomInput");
      }
      const structDefinition = (0, exports2.findStructDefinition)(jsonFile);
      if (structDefinition === null) {
        throw new Error(`Could not find struct definition in file ${jsonFile}`);
      }
      const abi = [];
      for (const member of structDefinition.members) {
        const type = member.typeDescriptions.typeString;
        if (type === void 0) {
          throw new Error(`Could not find type for member ${member.name}`);
        }
        abi.push({ name: member.name, type });
      }
      return abi;
    };
    exports2.getAbi = getAbi;
    var getInputs = (inputs2, inputSchema) => {
      const inputSchemaJson = JSON.parse(inputSchema);
      const keys = Object.keys(inputSchemaJson);
      const abi = (0, exports2.getAbi)();
      const rawInputs = (0, viem_1.decodeAbiParameters)(abi, inputs2);
      const circuitInputs2 = {};
      for (let i = 0; i < keys.length; i++) {
        if (Array.isArray(rawInputs[i])) {
          circuitInputs2[keys[i]] = rawInputs[i].map((x) => x.toString());
        } else {
          circuitInputs2[keys[i]] = rawInputs[i].toString();
        }
      }
      return circuitInputs2;
    };
    exports2.getInputs = getInputs;
  }
});

// dist/prove.js
var require_prove = __commonJS({
  "dist/prove.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prove = void 0;
    var js_1 = require("@axiom-crypto/circuit/js");
    var utils_1 = require("@axiom-crypto/circuit/cliHandler/utils");
    var utils_2 = require_utils();
    var core_1 = require("@axiom-crypto/core");
    var client_1 = require("@axiom-crypto/client");
    var utils_3 = require("@axiom-crypto/client/axiom/utils");
    var prove = async (compiledJson, inputs, providerUri, sourceChainId, callbackTarget, callbackExtraData, refundAddress, maxFeePerGas, callbackGasLimit, caller) => {
      const decoder = new TextDecoder();
      const provider = (0, utils_1.getProvider)(providerUri);
      let compiled = JSON.parse(compiledJson);
      const decodedArray = Buffer.from(compiled.circuit, "base64");
      const raw = decoder.decode(decodedArray);
      const AXIOM_CLIENT_IMPORT = require("@axiom-crypto/client");
      const circuit = new js_1.AxiomBaseCircuit({
        f: eval(raw),
        mock: true,
        provider,
        shouldTime: false,
        inputSchema: compiled.inputSchema
      });
      let decodedInputSchema = Buffer.from(compiled.inputSchema, "base64");
      const circuitInputs = (0, utils_2.getInputs)(inputs, decoder.decode(decodedInputSchema));
      const axiom = new core_1.AxiomSdkCore({
        providerUri: provider,
        chainId: sourceChainId,
        version: "v2"
      });
      try {
        let computeQuery;
        circuit.loadSavedMock(compiled);
        computeQuery = await circuit.mockProve(circuitInputs);
        const computeResults = circuit.getComputeResults();
        const dataQuery = circuit.getDataQuery();
        const res = {
          sourceChainId: circuit.getChainId(),
          computeQuery,
          computeResults,
          dataQuery
        };
        let build = await (0, client_1.buildSendQuery)({
          axiom,
          dataQuery: res.dataQuery,
          computeQuery: res.computeQuery,
          callback: {
            target: callbackTarget,
            extraData: callbackExtraData
          },
          options: {
            refundee: refundAddress,
            maxFeePerGas,
            callbackGasLimit: Number(callbackGasLimit)
          },
          caller
        });
        build.value = build.value.toString();
        const query = {
          value: build.value,
          mock: build.mock,
          queryId: build.queryId,
          args: (0, utils_3.argsArrToObj)(build.args),
          calldata: build.calldata,
          computeResults
        };
        console.log(JSON.stringify(query));
      } catch (e) {
        console.error(e);
      }
    };
    exports.prove = prove;
  }
});

// dist/axiom-std-cli.js
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var compile_1 = require_compile();
var prove_1 = require_prove();
var program = new commander_1.Command("axiom-std");
program.name("axiom-std").usage("axiom-std CLI");
program.command("readCircuit").description("Read and compile a circuit").argument("<circuitPath>", "path to the typescript circuit file").argument("<providerUri>", "provider to use").action(compile_1.compile);
program.command("prove").description("Prove a circuit").argument("<compiledJson>", "compiled json string").argument("<inputs>", "inputs to the circuit").argument("<providerUri>", "provider to use").argument("<sourceChainId>", "source chain id").argument("<callbackTarget>", "callback target").argument("<callbackExtraData>", "callback extra data").argument("<refundAddress>", "refund address").argument("<maxFeePerGas>", "max fee per gas").argument("<callbackGasLimit>", "callback gas limit").argument("<caller>", "caller").action(prove_1.prove);
program.parseAsync(process.argv);
