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
var fs_1 = __importDefault(require("fs"));
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var memory_cache_1 = __importDefault(require("memory-cache"));
var router = express_1.default.Router();
// Set cache duration to 1 hour
var CACHE_DURATION = 24 * 60 * 60 * 1000;
router.get('/prompt/:prompt', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var prompt, imageUrl, cachedImage, filename, imageBuffer, contentType, imageRes, contentType, imageBuffer, err_1, placeholderUrl, placeholderRes, contentType, placeholderBuffer, placeholderErr_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                prompt = req.params.prompt;
                imageUrl = "https://image.pollinations.ai/prompt/".concat(encodeURIComponent(prompt));
                cachedImage = memory_cache_1.default.get(imageUrl);
                if (cachedImage) {
                    res.setHeader('Content-Type', cachedImage.contentType);
                    res.send(cachedImage.data);
                    return [2 /*return*/];
                }
                filename = path_1.default.join(__dirname, '..', 'data', 'images', "".concat(encodeURIComponent(prompt), ".jpg"));
                if (fs_1.default.existsSync(filename)) {
                    imageBuffer = fs_1.default.readFileSync(filename);
                    contentType = 'image/jpeg';
                    res.setHeader('Content-Type', contentType);
                    res.send(imageBuffer);
                    // Store image in cache
                    console.log("Caching image ".concat(imageUrl));
                    memory_cache_1.default.put(imageUrl, { contentType: contentType, data: imageBuffer }, CACHE_DURATION);
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 10]);
                return [4 /*yield*/, fetch(imageUrl)];
            case 2:
                imageRes = _a.sent();
                if (!imageRes.ok) {
                    throw new Error("Error fetching image from ".concat(imageUrl, ": ").concat(imageRes.status, " ").concat(imageRes.statusText));
                }
                contentType = imageRes.headers.get('content-type');
                if (!contentType || !contentType.startsWith('image/')) {
                    throw new Error("Invalid content type for image: ".concat(contentType));
                }
                return [4 /*yield*/, imageRes.arrayBuffer()];
            case 3:
                imageBuffer = _a.sent();
                // Set Content-Type header only once
                res.setHeader('Content-Type', contentType || '');
                res.send(Buffer.from(imageBuffer));
                // Store image in cache and on disk
                console.log("Caching image ".concat(imageUrl));
                memory_cache_1.default.put(imageUrl, { contentType: contentType || '', data: Buffer.from(imageBuffer) }, CACHE_DURATION);
                fs_1.default.writeFileSync(filename, Buffer.from(imageBuffer));
                console.log("Saved image to disk: ".concat(filename));
                return [3 /*break*/, 10];
            case 4:
                err_1 = _a.sent();
                console.error("Error fetching image from ".concat(imageUrl, ": ").concat(err_1.message));
                placeholderUrl = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
                _a.label = 5;
            case 5:
                _a.trys.push([5, 8, , 9]);
                return [4 /*yield*/, fetch(placeholderUrl)];
            case 6:
                placeholderRes = _a.sent();
                if (!placeholderRes.ok) {
                    throw new Error("Error fetching placeholder image from ".concat(placeholderUrl, ": ").concat(placeholderRes.status, " ").concat(placeholderRes.statusText));
                }
                contentType = placeholderRes.headers.get('content-type');
                return [4 /*yield*/, placeholderRes.arrayBuffer()];
            case 7:
                placeholderBuffer = _a.sent();
                // Set Content-Type header before sending the response
                res.setHeader('Content-Type', contentType || '');
                res.send(Buffer.from(placeholderBuffer));
                return [2 /*return*/];
            case 8:
                placeholderErr_1 = _a.sent();
                console.error("Error fetching placeholder image from ".concat(placeholderUrl, ": ").concat(placeholderErr_1.message));
                res.status(500).send("Error fetching image from ".concat(imageUrl));
                return [2 /*return*/];
            case 9: return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
