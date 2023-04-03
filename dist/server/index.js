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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var next_1 = __importDefault(require("next"));
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cookie_session_1 = __importDefault(require("cookie-session"));
var body_parser_1 = __importDefault(require("body-parser"));
var dotenv_1 = __importDefault(require("dotenv"));
var sendMessage_1 = require("./sendMessage");
var tools_1 = __importDefault(require("./routes/tools"));
var image_1 = __importDefault(require("./routes/image"));
var sendMessage_2 = __importDefault(require("./routes/sendMessage"));
var messaging_1 = require("./messaging");
dotenv_1.default.config();
var LEXISERVER_PORT = parseInt(process.env.LEXISERVER_PORT || '1618');
var LEXIWEBSOCKETSERVER_PORT = parseInt(process.env.LEXIWEBSOCKETSERVER_PORT || '1619');
var DEV = process.env.NODE_ENV !== 'production';
var app = (0, next_1.default)({ dev: DEV });
var handle = app.getRequestHandler();
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        var server, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, app.prepare()];
                case 1:
                    _a.sent();
                    server = (0, express_1.default)();
                    // Middleware
                    server.use(body_parser_1.default.json({ limit: '10mb' }));
                    server.use(body_parser_1.default.urlencoded({ limit: '10mb', extended: true }));
                    server.use(express_1.default.static('public'));
                    server.use((0, cookie_parser_1.default)());
                    server.use((0, cookie_session_1.default)({
                        name: 'session',
                        keys: ['eThElIMpLYMOSeAMaNKlEroashIrOw'],
                        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                    }));
                    // Routes
                    server.use('/send-message', sendMessage_2.default);
                    server.use('/image', image_1.default);
                    server.use('/tools', tools_1.default);
                    server.all('/next/*', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            res.status(400).json({ error: 'Next API route not found' });
                            return [2 /*return*/];
                        });
                    }); });
                    server.all('*', function (req, res) { return handle(req, res); });
                    return [4 /*yield*/, (0, messaging_1.startMessagingServer)(LEXIWEBSOCKETSERVER_PORT)];
                case 2:
                    _a.sent();
                    (0, sendMessage_1.sendMessage)({
                        conversationId: '',
                        parentMessageId: '',
                        personaLabel: 'Lexi',
                        systemMessage: 'You are an especially creative autonomous cognitive entity named Lexi.',
                        userLabel: 'user',
                        message: 'State if you are functioning properly. What is your name?',
                        onComplete: function (_a) {
                            var response = _a.response;
                            return console.log(response);
                        },
                        onProgress: function () { },
                    });
                    server.listen(LEXISERVER_PORT, function () {
                        console.log('🟣', "I'm listening on port ".concat(LEXISERVER_PORT, "."));
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
startServer();
